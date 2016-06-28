import {Component, ElementRef, AfterViewInit, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {GoogleMap, GoogleMapsEvent, GoogleMapsMarker, GoogleMapsLatLng, GoogleMapsPolyline} from 'ionic-native';

export {GoogleMapsLatLng} from 'ionic-native';

export interface ViewNativeMarker {
    name: string;
    marker: GoogleMapsMarker;
}

/*
  Created by skaldo and mmueller on the 09.05.2016.
  
  This is Map component for the CitizenApplication.
*/
@Component({
    selector: 'native-map',
    templateUrl: 'build/components/native-map/map.html'
})
export class NativeMap implements OnDestroy, AfterViewInit {
    @Output() markerClicked = new EventEmitter<ViewNativeMarker>();
    @Output() mapClicked = new EventEmitter<GoogleMapsLatLng>();
    private map: GoogleMap;
    private mapElement: HTMLElement;
    private logger: Logger;
    private mapElementId;
    private markers: { [key: string]: GoogleMapsMarker } = {};
    private isSuspended: boolean;

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
        this.map.refreshLayout();

        this.map.on('click').subscribe((latLng: GoogleMapsLatLng) => {
            if (this.isSuspended) {
                return;
            }
            console.debug('map clicked at:', latLng);
            this.mapClicked.emit(latLng);
        });
    }

    setCenter(center: GoogleMapsLatLng, zoom?: number) {
        if (zoom) {
            this.map.setZoom(zoom);
        }
        this.map.setCenter(center);
    }

    centerCamera() {
        let options = { timeout: 10000, enableHighAccuracy: true };
        Geolocation.getCurrentPosition(options).then((resp) => {
            let latitude = resp.coords.latitude;
            let longitude = resp.coords.longitude;
            this.map.animateCamera({
                'target': new GoogleMapsLatLng(latitude, longitude), // Somehow the GoogleMapsLatLng() does not pass the build.
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
    addMarker(name: string, color: string, pos: GoogleMapsLatLng) {
        this.map.addMarker({
            'position': pos,
            'title': name,
            'icon': color
        }).then((marker) => {
            marker.addEventListener('click').subscribe(() => {
                if (this.isSuspended) {
                    return;
                }
                this.logger.debug('marker clicked: ' + name);
                this.markerClicked.emit(<ViewNativeMarker>{ name: name, marker: marker });
            });
            this.markers[name] = marker;
        });
    }

    /**
     * @param markername String name of the marker to be deleted
     */
    deleteMarker(markername) {
        console.log('delete marker called');
        let marker = this.markers[markername];
        if (!marker) {
            return;
        }
        marker.remove();
        delete this.markers[markername];
        console.log(this.markers);
    }

    /**
     * @param markername to be moved
     * @param newColor new Color after being moved
     * @param pos new Destination
     */
    moveMarker(markername: string, newColor: string, pos: GoogleMapsLatLng) {
        console.log(markername + ' will be moved');
        this.deleteMarker(markername);
        this.addMarker(markername, newColor, pos);
    }

    setClickable(clickable) {
        this.map.setClickable(clickable);
    }

    ngOnDestroy() {
        this.logger.debug('Removing the map element along with all the children.');
        while (this.mapElement.firstChild) {
            this.mapElement.removeChild(this.mapElement.firstChild);
        }
        this.map.refreshLayout();
    }

    /**
     * Destroy the map
     */
    // ionViewWillLeave() {
    suspend(suspend) {
        if (suspend) {
            console.info('suspending map');
            this.isSuspended = true;
            this.mapElement.setAttribute('hidden', '');
        }
        else {
            console.info('resuming map');
            this.isSuspended = false;
            this.mapElement.removeAttribute('hidden');
        }
        this.map.refreshLayout();
    }

    /**
     * Re-create the map
     */
    ionViewDidEnter() {
        console.info('restoring map');
        this.mapElement.removeAttribute('hidden');
        this.map.refreshLayout();
    }
}

