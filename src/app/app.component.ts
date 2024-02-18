import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import file from '../data/tripadvisor-20240218.json';
import type { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';

import type { Outfile, PlaceType } from '../types/types'
// import 'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'
// import 'node_modules/leaflet.markercluster/dist/MarkerCluster.css'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	outfiles: Outfile[] = [file]; //Can import and display multiple files

	markerClusterGroup: L.MarkerClusterGroup
	markerClusterData = []

	layersControl: LeafletControlLayersConfig = {
		baseLayers: {},
		overlays: {}
	}

	options: L.MapOptions = {
		layers: [
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' })
		],
		zoom: 5,
		center: L.latLng(59, 19)
	};
	
	constructor() {
		this.markerClusterGroup = L.markerClusterGroup({
			removeOutsideVisibleBounds: true,
			// iconCreateFunction: function(cluster) {
			// 	return L.divIcon({ html: '<span class="marker-cluster-small">' + cluster.getChildCount() + '</span>' });
			// }
		})
	}
 
	private makeMarkerColorClass = (index: number): string => `marker-color-${index}`

	readonly getIconOptions = (type: PlaceType) => {
		let iconFilename = 'pin-orange.png'
		let iconSize: L.PointExpression   = [13, 13]
		let iconAnchor: L.PointExpression = [ 0, 13]
		if (type === 'fav') {
			iconFilename = 'pin-heart.png'
			iconSize   = [19, 20]
			iconAnchor = [ 0, 20]
		} else if (type === 'want') {
			iconFilename = 'pin-green.png'
		}

		return {
			iconSize,
			iconAnchor,
			iconUrl: `assets/images/${iconFilename}`
		}
	}
	private makeMarker = (lat: number, lon: number, text: string, colorClass: string, type: PlaceType) => {
		const iconOptions = this.getIconOptions(type)
		return L.marker(
			[ lat, lon ],
			{
				icon: L.icon({
					...iconOptions,
					className: colorClass
				})
			}
		).bindTooltip(text);
	}

	// If layers are not added to map, they will have to be clicked in the layers control corner to be visible
	onMapReady(map: L.Map) {
		for (const layer of Object.values(this.layersControl.overlays)) {
			// Don't use clustering:
			map.addLayer(layer)
			
			// Use clustering:
			// this.markerClusterGroup.addLayer(layer);
		}
		this.markerClusterGroup.addTo(map);
	}
	
	ngOnInit(): void {
		let markersWithoutCoords: string[] = []

		this.outfiles.forEach((jsonFile, fileI) => {
			console.log('outfile', fileI, jsonFile);
			
			let markers: L.Layer[] = [];

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

			this.layersControl.overlays[`Person ${fileI + 1}`] = new L.LayerGroup(markers)
		})

		markersWithoutCoords.length > 0 && console.warn('Places without coordinates', markersWithoutCoords);
	}
}
