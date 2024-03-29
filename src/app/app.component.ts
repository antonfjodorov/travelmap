import { Component, OnInit } from '@angular/core';
import { Layer, LayerGroup, Map, MapOptions, PointExpression, icon, latLng, marker, tileLayer } from 'leaflet';
import file from '../data/tripadvisor-20240218.json';
import type { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';

import type { Outfile, PlaceType } from '../types/types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	outfiles: Outfile[] = [file]; //Can import and display multiple files
	
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

	// If layers are not added to map, they will have to be clicked in the layers control corner to be visible
	onMapReady(map: Map) {
		for (const layer of Object.values(this.layersControl.overlays)) {
			map.addLayer(layer)
		}
	}

	ngOnInit(): void {
		let markersWithoutCoords: string[] = []

		this.outfiles.forEach((jsonFile, fileI) => {
			console.log('outfile', fileI, jsonFile);
			
			let markers: Layer[] = [];

			Object.keys(jsonFile).forEach(k => {
				const lat  = jsonFile[k]?.latitude
				const lon  = jsonFile[k]?.longitude
				const type = jsonFile[k]?.type || 'been'

				if (lat && lon) {
					const marker = this.makeMarker(lat, lon, k, this.makeMarkerColorClass(0), type)
					markers.push(marker);
				} else {
					markersWithoutCoords.push(k)
				}
			})

			this.layersControl.overlays[`Person ${fileI + 1}`] = new LayerGroup(markers)
		})

		markersWithoutCoords.length > 0 && console.warn('Places without coordinates', markersWithoutCoords);
	}
}
