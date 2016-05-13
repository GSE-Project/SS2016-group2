import {Component, ElementRef, OnInit} from 'angular2/core';
import {Geolocation} from 'ionic-native';

/*
  Created by skaldo and mmueller on the 09.05.2016.
  
  This is Map component for the CitizenApplication.
*/
@Component({
  selector: 'map',
  templateUrl: 'build/components/map/map.html'
})
export class Map implements OnInit, OnInit {
  private map: google.maps.Map;
  
  private defaultMapOptions = {
    zoom: 15,
    mypTypeId: google.maps.MapTypeId.ROADMAP,
  }
  private defaultGeoLocationOptions = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  constructor(private element: ElementRef) {
  }

  centerMap(center?: google.maps.LatLng) {
    if (!center) {
      Geolocation.getCurrentPosition(this.defaultGeoLocationOptions).then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.centerMap(latLng);
      });
      return;
    }
    this.map.setCenter(center);
  }

  createMap() {
    let element = this.element.nativeElement.querySelector('.mapElement');
    this.map = new google.maps.Map(element, this.defaultMapOptions);
  }

  ngOnInit() {
    this.createMap();
    this.centerMap();
  }

  addMarker(position: google.maps.LatLng) {
    
      let markerLatLong = new google.maps.LatLng(position.lat(), position.lng());
      let marker = new google.maps.Marker({
        position: markerLatLong,
        map: this.map,
        title: 'Hello World!'
      });
      marker.setMap(this.map);
    
  }
}
