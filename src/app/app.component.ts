import { Component, OnInit } from '@angular/core';
import { Layer, icon, latLng, marker, tileLayer } from 'leaflet';
import { PlaceCache } from 'src/types/types';
import cache1 from '../data/cache-1.json';
import cache2 from '../data/cache-2.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	caches: PlaceCache[] = [cache1, cache2]
  markers: Layer[] = [];
	markerColorClasses = ['marker-blue', 'marker-pink']

	options = {
		layers: [
			tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' })
		],
		zoom: 5,
		center: latLng(59, 19)
	};
 
	private addMarker(lat: number, lon: number, text: string, colorClass: string) {
		const newMarker = marker(
			[ lat, lon ],
			{
				icon: icon({
					iconSize: [ 25, 41 ],
					iconAnchor: [ 13, 41 ],
					iconUrl: 'leaflet/marker-icon.png',
					iconRetinaUrl: 'leaflet/marker-icon-2x.png',
					shadowUrl: 'leaflet/marker-shadow.png',
					className: colorClass
				})
			}
		).bindTooltip(text);

		this.markers.push(newMarker);
	}

  ngOnInit(): void {
		this.caches.forEach((cache, cacheI) => {
			Object.keys(cache).forEach(k => {
				const lat = cache[k].latitude
				const lon = cache[k].longitude
				if (lat && lon) this.addMarker(lat, lon, k, this.markerColorClasses[cacheI])
			})
		})
  }
}
