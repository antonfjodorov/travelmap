import { Component, OnInit } from '@angular/core';
import { Layer, LayerGroup, MapOptions, PointExpression, icon, latLng, marker, tileLayer } from 'leaflet';
import cache1 from '../data/tripadvisor-1.json';
import cache2 from '../data/tripadvisor-2.json';
import type { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';

import type { Cachefile, PlaceType } from '../types/types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	caches: Cachefile[] = [cache1, cache2]

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

	private makeMarker = (lat: number, lon: number, text: string, colorClass: string, type: PlaceType) => {
		let iconFilename = 'pin-orange.png'
		let iconSize: PointExpression   = [13, 13]
		let iconAnchor: PointExpression = [ 0, 13]
		if (type === 'fav') {
			iconFilename = 'pin-heart.png'
			iconSize   = [19, 20]
			iconAnchor = [ 0, 20]
		}
		else if (type === 'want') {
			iconFilename = 'pin-green.png'
		}

		return marker(
			[ lat, lon ],
			{
				icon: icon({
					iconSize,
					iconAnchor,
					iconUrl: `assets/images/${iconFilename}`,
					className: colorClass
				})
			}
		).bindTooltip(text);
	}

  ngOnInit(): void {
		let markersWithoutCoords: string[] = []

		this.caches.forEach((cache, cacheI) => {
			console.log('cache', cacheI, cache);
			
			let markers: Layer[] = [];

			Object.keys(cache).forEach(k => {
				const lat = cache[k]?.latitude
				const lon = cache[k]?.longitude
				const type = cache[k]?.type || 'been'

				if (lat && lon) {
					const marker = this.makeMarker(lat, lon, k, this.makeMarkerColorClass(0), type)
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
