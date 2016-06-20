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
        console.log('successfully loaded map');
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
            this.addMarker('tester', 49.1, 8.2);
            // this.moveMarker('tester', 20.2, 20.2)
        }).catch((error) => {
            this.logger.error('error occured while getting the location: ' + error);
        });
    }

    /**
     * @param name name of the marker
     * @param lat latitude
     * @param lng longitude
     */
    addMarker(name, lat, lng) {
        let pos = new GoogleMapsLatLng(lat.toString(), lng.toString());
        let marker = new GoogleMapsMarker({
                'position': pos,
                'title': 'test'
            });
        this.markers[name] = marker;
        this.map.addMarker(marker);
        console.log('new marker added to markers' + this.markers );
    }

    /**
     * @param markername String name of the marker to be deleted
     */
    deleteMarker(markername) {
        let marker = this.markers[markername];
        marker.remove();
        console.log('removed marker ' + markername);
    }

    /**
     * @param markername to be moved
     * @param moveToX new X Destination
     * @param moveToY new Y Destination
     */
    moveMarker(markername, moveToX, moveToY) {
        console.log(markername + ' will be moved');
        this.markers[markername].setPosition(new GoogleMapsLatLng(moveToX.toString(), moveToY.toString()));
    }

    /**
     * loads the stops and shows them as a marker on the map
     * @param linestopscoordinates list of coordinates of the linetops
     * @param linestopsnames list of the names of the linetops
     */
    /*
    loadStops(linestopscoordinates, linestopsnames) {
        for (let index = 0; index < linestopscoordinates.length; index++) {
            let stopLatLng = new GoogleMapsLatLng(linestopscoordinates[index][1].toString(), linestopscoordinates[index][0].toString());
            this.map.addMarker({
                'position': stopLatLng,
                'title': linestopsnames[index]
            });
        };
    }
    */

    /**
     * shows the bus position
     * @param busX current x-coord of the bus
     * @param busY current y-ccord of the bus
    */

    /*
    showBus(busX, busY) {
        let busLatLng = new GoogleMapsLatLng(busX, busY);
        this.map.addMarker({
            'position': busLatLng,
            'title': 'busposition'
        }, function (marker) {
            marker.showInfoWindow();
        });
    }
    */

    ngOnDestroy() {
        this.logger.debug('Removing the map element along with all the children.');
        while (this.mapElement.firstChild) {
            this.mapElement.removeChild(this.mapElement.firstChild);
        }
    }

}

