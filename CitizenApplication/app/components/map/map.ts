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
export class Map implements OnInit {
  private map: google.maps.Map;
  private markers: { [key: string]: google.maps.Marker; } = {};

  private defaultMapOptions = {
    zoom: 15,
    mypTypeId: google.maps.MapTypeId.ROADMAP,
  };

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
      }).catch(error => {
        // Handling the error.
        console.log('Unable to get the current location. ' + error);
        console.log('Setting: 49.4428949, 7.5893631 as center.');
        this.centerMap(new google.maps.LatLng(49.4428949, 7.5893631));
      });
      return;
    }
    this.map.setCenter(center);
  }

  createMap() {
    let element = this.element.nativeElement.children[0];
    this.map = new google.maps.Map(element, this.defaultMapOptions);
    console.log(element);
  }

  ngOnInit() {
    this.createMap();
    this.centerMap();
    this.initPositionMarker();
  }

  initPositionMarker() {
    Geolocation.getCurrentPosition(this.defaultGeoLocationOptions).then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.addMarker(latLng, 'Standort');
    }).catch(error => {
      // Handling the error.
      console.log('Unable to get the current location. ' + error);
    });
  }

  /**
   * @param position new markers position
   * @param name new markers identify name
  */
  addMarker(position: google.maps.LatLng, name) {
    let markerLatLong = position;
    let marker = new google.maps.Marker({
      position: markerLatLong,
      map: this.map,
      title: name

    });

    this.markers[name] = marker;


  }

  /**
   * @param markername Marker to be deleted
  */
  deleteMarker(markername) {
    /*
    deletes one marker identified by its name, for example
     this.deleteMarker("Standort"); 
     for deleting of the marker of the current position
     specified in initPositionMarker
    */
    this.markers[markername].setMap(null);
  }

  /**
  * @param markername Markers name which should be moved to
  * @param pos new Position
  */
  moveMarker(markername, pos) {
    this.deleteMarker(markername);
    this.addMarker(pos, markername);
  }
}
