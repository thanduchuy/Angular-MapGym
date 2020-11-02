import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ConvertPlaceService } from '../services/convert-place.service';
import { MapService } from '../services/map.service';
import { Search } from '../models/searchMap'
import { icon, latLng, Map, marker, point, polyline, tileLayer, featureGroup, LatLngBounds } from 'leaflet';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  cinemaIcon = L.icon({
    iconUrl: '../assets/gym.png',
    // shadowUrl: '../assets/cinema.png',

    iconSize: [80, 80], // size of the icon
    // shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  map: L.Map;

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  placeInput: String
  latitude: number = 16.047079
  longitude: number = 108.206230

  options = {
    layers: [this.streetMaps],
    zoom: 15,
    radius: 300,
    center: latLng(this.latitude, this.longitude),

  };


  searchForm: Search = {
    f: 'json',
    latitude: 0,
    longitude: 0,
    category: 'Fitness Center',
    maxLocations: 5,
    outFields: 'Place_addr, PlaceName',
  }

  placeFound = []

  constructor(private convertPlaceService: ConvertPlaceService, private MapService: MapService) {

  }

  ParseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    return this.ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  }

  ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }

  convertPlace() {
    this.convertPlaceService.convertPlace(this.placeInput).subscribe(
      (doc) => {

        this.latitude = this.ParseDMS(doc.results[0].annotations.DMS.lat)
        this.longitude = this.ParseDMS(doc.results[0].annotations.DMS.lng)

        //this.searchForm.location = this.latitude + "," + this.longitude
        this.searchForm.latitude = this.latitude;
        this.searchForm.longitude = this.longitude

        // console.log(this.latitude + " " + this.longitude);
        return this.searchForm
      }

    )
  }

  onMapReady(map: L.Map) {
    console.log('map')
    this.map = map;

  }

  findPlace() {
    //this.convertPlace()
    this.placeFound = []
    this.map.panTo(new L.LatLng(this.latitude, this.longitude));
    if (this.searchForm.latitude !== 0 || this.searchForm.longitude !== 0) {
      this.MapService.findMap(this.searchForm).subscribe(
        (doc) => {
          console.log(doc.candidates)
          doc.candidates.forEach(e => {
            this.placeFound.push(marker([e.location.y, e.location.x])
              .bindPopup("<b>GYM Name: </b>" + e.address + '.<br><b>Address: </b> ' + e.attributes.Place_addr)
              .openPopup()
              //.bindTooltip(e.attributes.Place_addr)
              .setIcon(this.cinemaIcon))
          });

          if (this.placeFound.length > 0) {
            const group = featureGroup(this.placeFound)
            group.addTo(this.map);
            this.map.fitBounds(group.getBounds());
          }

          console.log(this.placeFound.length)
        }
      )
    }
  }

  ngOnInit() {

  }

}
