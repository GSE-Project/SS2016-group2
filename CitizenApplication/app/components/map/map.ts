import {Component, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {GoogleMap, GoogleMapsEvent} from 'ionic-native';

/*
  Created by skaldo and mmueller on the 09.05.2016.
  
  This is Map component for the CitizenApplication.
*/
@Component({
  selector: 'map',
  templateUrl: 'build/components/map/map.html'
})
export class Map implements AfterViewInit, OnDestroy {
  private map: google.maps.Map;
  private markers: { [key: string]: google.maps.Marker; } = {};
  private mapElement;

  private logger: Logger;

  private defaultMapOptions = {
    center: new google.maps.LatLng(49.4428949, 7.5893631),
    zoom: 15,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.SATELLITE
      ]
    },
    zoomControl: true,
    rotateControl: true
  };

  private defaultGeoLocationOptions = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  constructor(private element: ElementRef, private config: ConfigurationService) {
    this.logger = new LoggerFactory().getLogger(this.config.misc.log_level, 'MapComponent', this.config.misc.log_pretty_print);
  }

  centerMap(center?: google.maps.LatLng) {
    this.logger.debug('centering');
    if (!center) {
      this.logger.debug('getCurrentPosition');
      Geolocation.getCurrentPosition(this.defaultGeoLocationOptions).then((position) => {
        this.logger.debug('got location: ' + position);
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.centerMap(latLng);
      }).catch(error => {
        // Handling the error.
        this.logger.error('Unable to get the current location. ' + error);
        this.logger.error('Setting: 49.4428949, 7.5893631 as center.');
        this.centerMap(new google.maps.LatLng(49.4428949, 7.5893631));
      });
      return;
    }
    this.map.setCenter(center);
  }

  createMap() {
    this.mapElement = this.element.nativeElement.children[0];
    //this.map = new google.maps.Map(this.mapElement, this.defaultMapOptions);
    let map = new GoogleMap(this.mapElement);
  }

  ngAfterViewInit() {
    this.createMap();
    //this.centerMap();
    //this.initPositionMarker();
  }

  ngOnDestroy() {
    this.logger.debug('Removing the map element along with all the children.');
    while (this.mapElement.firstChild) {
      this.mapElement.removeChild(this.mapElement.firstChild);
    }
  }

  initPositionMarker() {
    Geolocation.getCurrentPosition(this.defaultGeoLocationOptions).then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.addPositionMarker(latLng, 'Standort');
    }).catch(error => {
      // Handling the error.
      this.logger.error('Unable to get the current location. ' + error);
    });
  }

  /**
   * Adds a neutral marker
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
   * Adds a neutral marker
   * @param position new markers position
   * @param name new markers identify name
  */
  addPositionMarker(position: google.maps.LatLng, name) {
    let markerLatLong = position;

    let marker = new google.maps.Marker({
      position: markerLatLong,
      map: this.map,
      title: name,
      icon: {
        anchor: new google.maps.Point(16, 16),
        url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkViZW5lXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MS4zIDY2LjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxLjMgNjYuMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7c3Ryb2tlOiMxRDFEMUI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MXtmaWxsOiM1QzVDNUM7c3Ryb2tlOiMxRDFEMUI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MntzdHJva2U6IzFEMUQxQjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Qze2ZpbGw6bm9uZTtzdHJva2U6IzFEMUQxQjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+Cjx0aXRsZT5wb3NpdGlvbl9pY29uPC90aXRsZT4KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMjUuNyIgY3k9IjQwLjQiIHI9IjI1LjIiLz4KPGVsbGlwc2UgY2xhc3M9InN0MSIgY3g9IjI1LjciIGN5PSIxMC45IiByeD0iMTcuMSIgcnk9IjEwLjQiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTUwLjcsMTUuOHYxLjVjMCwyLjUtMiw0LjUtNC41LDQuNWgtNDFjLTIuNSwwLTQuNS0yLTQuNS00LjV2LTEuNWMwLTIuNSwyLTQuNSw0LjUtNC41aDQxCglDNDguNywxMS4zLDUwLjcsMTMuMyw1MC43LDE1Ljh6Ii8+CjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjM4LjMiIGN5PSIzMC41IiByPSI0LjQiLz4KPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMzguMyIgY3k9IjMwLjUiIHI9IjEuNCIvPgo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIxMy40IiBjeT0iMzAuNSIgcj0iNC40Ii8+CjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEzLjQiIGN5PSIzMC41IiByPSIxLjQiLz4KPHBhdGggY2xhc3M9InN0MyIgZD0iTTksNDkuMWMwLDcuOCwzMy43LDgsMzMuNywwIi8+CjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0yNS45LDQ5LjFjLTMuNi0wLjMtMS41LTcuNiwwLTE0LjEiLz4KPC9zdmc+Cg=='
      }
    });

    this.markers[name] = marker;
  }

  addBusMarker(position: google.maps.LatLng, name) {
    let markerLatLong = position;

    let marker = new google.maps.Marker({
      position: markerLatLong,
      map: this.map,
      title: name,
      icon: {
        anchor: new google.maps.Point(16, 16),
        url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkViZW5lXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2MC40IDY2LjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYwLjQgNjYuNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtzdHJva2U6IzFEMUQxQjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Qxe2ZpbGw6IzNENTdBMzt9Cgkuc3Qye2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qze2ZpbGw6IzkyOTI5MztzdHJva2U6IzFEMUQxQjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Q0e2ZpbGw6I0Y5RjZDNjtzdHJva2U6IzFEMUQxQjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+Cjx0aXRsZT5idXNfaWNvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zLjYsNTguNGgwLjljMS4xLDAsMi4xLDAuOSwyLjEsMi4xdjIuNGMwLDEuMS0wLjksMi4xLTIuMSwyLjFIMy42Yy0xLjEsMC0yLjEtMC45LTIuMS0yLjF2LTIuNAoJQzEuNiw1OS40LDIuNSw1OC40LDMuNiw1OC40eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTUuOSw1OWgwLjljMS4xLDAsMi4xLDAuOSwyLjEsMi4xdjIuNGMwLDEuMS0wLjksMi4xLTIuMSwyLjFoLTAuOWMtMS4xLDAtMi4xLTAuOS0yLjEtMi4xVjYxCglDNTMuOCw1OS45LDU0LjcsNTksNTUuOSw1OXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTU3LjcsMGgtNTVDMS4yLDAsMCwxLjIsMCwyLjd2NTVjMCwxLjUsMS4yLDIuNywyLjcsMi43aDU1YzEuNSwwLDIuNy0xLjIsMi43LTIuN3YtNTVDNjAuNCwxLjIsNTkuMiwwLDU3LjcsMHoKCSBNNTYuNCw0NC4zYzAsMS41LTEuMiwyLjctMi43LDIuN0g2LjhjLTEuNSwwLTIuNy0xLjItMi43LTIuN1YxNi4yYzAtMS41LDEuMi0yLjcsMi43LTIuN2g0Ni44YzEuNSwwLDIuNywxLjIsMi43LDIuN0w1Ni40LDQ0LjMKCUw1Ni40LDQ0LjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02LjgsMTMuNGg0Ni44YzEuNSwwLDIuNywxLjIsMi43LDIuN3YyOC4yYzAsMS41LTEuMiwyLjctMi43LDIuN0g2LjhjLTEuNSwwLTIuNy0xLjItMi43LTIuN1YxNi4xCglDNC4xLDE0LjYsNS4zLDEzLjQsNi44LDEzLjR6Ii8+CjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik01NS41LDEwLjZINC45Yy0wLjUsMC0wLjgtMC40LTAuOC0wLjhWNS42YzAtMC41LDAuNC0wLjgsMC44LTAuOGg1MC42YzAuNSwwLDAuOCwwLjQsMC44LDAuOHY0LjIKCUM1Ni40LDEwLjMsNTYsMTAuNiw1NS41LDEwLjZ6Ii8+CjxjaXJjbGUgY2xhc3M9InN0NCIgY3g9IjcuOCIgY3k9IjUzLjkiIHI9IjMuNyIvPgo8Y2lyY2xlIGNsYXNzPSJzdDQiIGN4PSI1Mi42IiBjeT0iNTMuOSIgcj0iMy43Ii8+Cjwvc3ZnPgo='
      }
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
