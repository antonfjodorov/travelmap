import { Component, OnInit } from '@angular/core';
import { Layer, LayerGroup, MapOptions, icon, latLng, marker, tileLayer } from 'leaflet';
import { PlaceCache } from 'src/types/types';
import cache1 from '../data/cache-1.json';
import cache2 from '../data/cache-2.json';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	caches: PlaceCache[] = [cache1, cache2]

	options: MapOptions = {
		layers: [
			tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' })
		],
		zoom: 5,
		center: latLng(59, 19)
	};
	
	layersControl: LeafletControlLayersConfig = {
		baseLayers: {},
		overlays: {}
	}
 
	private makeMarkerColorClass = (index: number): string => `marker-color-${index}`

	private makeMarker = (lat: number, lon: number, text: string, colorClass: string) =>
		marker(
			[ lat, lon ],
			{
				icon: icon({
					iconSize: [ 20, 20 ],
					iconAnchor: [ 0, 26 ],
					iconUrl: 'assets/images/pin-orange.png',
					className: colorClass
				})
			}
		).bindTooltip(text);

  ngOnInit(): void {
		let markersWithoutCoords: string[] = []

		this.caches.forEach((cache, cacheI) => {
			let markers: Layer[] = [];

			Object.keys(cache).forEach(k => {
				const lat = cache[k].latitude
				const lon = cache[k].longitude
				if (lat && lon) {
					const marker = this.makeMarker(lat, lon, k, this.makeMarkerColorClass(cacheI))
					markers.push(marker);
				} else {
					markersWithoutCoords.push(k)
				}
			})

			this.layersControl.overlays[`Person ${cacheI + 1}`] = new LayerGroup(markers)
		})

		markersWithoutCoords.length > 0 && console.warn('Places without coordinates', markersWithoutCoords);
  }
}
