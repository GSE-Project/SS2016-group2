import {Component, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {GoogleMap, GoogleMapsEvent, GoogleMapsMarker, GoogleMapsLatLng, GoogleMapsPolyline} from 'ionic-native';

/*
  Created by skaldo and mmueller on the 09.05.2016.
  
  This is Map component for the CitizenApplication.
*/
@Component({
    selector: 'native-map',
    templateUrl: 'build/components/native-map/map.html'
})
export class NativeMap implements OnDestroy, AfterViewInit {
    private map;
    private mapElement;
    private logger: Logger;
    private mapElementId;
    private markers: { [key: string]: GoogleMapsMarker } = {};

    constructor(private element: ElementRef, private config: ConfigurationService) {
        this.logger = new LoggerFactory().getLogger(this.config.misc.log_level, 'MapComponent', this.config.misc.log_pretty_print);
    }

    ngAfterViewInit() {
        this.render();
    }

    render() {
        // Generate pseudorandom ID of the div, as the Ionic native plugin does not accept the element object,
        // but just the div id.
        this.mapElementId = 'map' + new Date().getTime();
        this.mapElement = this.element.nativeElement; // .children[0];
        this.mapElement.setAttribute('id', this.mapElementId);
        let map = new GoogleMap(this.mapElementId);
        this.map = map;
        this.map.setOptions({
            'backgroundColor': 'white',
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'zoom': true // Only for Android
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            },
        });
        this.centerCamera();
        this.map.refreshLayout();
    }

    centerCamera() {
        let options = { timeout: 10000, enableHighAccuracy: true };
        Geolocation.getCurrentPosition(options).then((resp) => {
            let latitude = resp.coords.latitude;
            let longitude = resp.coords.longitude;
            this.map.animateCamera({
                'target': new GoogleMapsLatLng(latitude.toString(), longitude.toString()), // Somehow the GoogleMapsLatLng() does not pass the build.
                'tilt': 10,
                'zoom': 18,
                'bearing': 0
            });
        }).catch((error) => {
            this.logger.error('error occured while getting the location: ' + error);
        });
    }

    /**
     * Adds a Marker
     * @param name name of the marker
     * @param color e.g. 'blue' 
     * @param lat latitude
     * @param lng longitude
     */
    addMarker(name, color, lat, lng) {
        let pos = new GoogleMapsLatLng(lat, lng);
        this.map.addMarker({
            'position': pos,
            'title': name,
            'icon': color
        }).then((marker) => {
            this.markers[name] = marker;
        });
    }

    /**
     * @param markername String name of the marker to be deleted
     */
    deleteMarker(markername) {
        console.log('delete marker called');
        let marker = this.markers[markername];
        marker.remove();
        delete this.markers[markername];
        console.log(this.markers);
    }

    /**
     * @param markername to be moved
     * @param newColor new Color after being moved
     * @param moveToX new X Destination
     * @param moveToY new Y Destination
     */
    moveMarker(markername, newColor, moveToX, moveToY) {
        console.log(markername + ' will be moved');
        this.deleteMarker(markername);
        this.addMarker(markername, newColor, moveToX, moveToY);
    }

    ngOnDestroy() {
        this.logger.debug('Removing the map element along with all the children.');
        while (this.mapElement.firstChild) {
            this.mapElement.removeChild(this.mapElement.firstChild);
        }
    }

}

