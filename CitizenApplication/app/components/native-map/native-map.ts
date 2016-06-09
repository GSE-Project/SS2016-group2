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
  selector: 'native-map',
  templateUrl: 'build/components/native-map/map.html'
})
export class NativeMap implements OnDestroy {
  private map: google.maps.Map;
  private mapElement;
  private logger: Logger;
  private mapElementId;

  constructor(private element: ElementRef, private config: ConfigurationService) {
    this.logger = new LoggerFactory().getLogger(this.config.misc.log_level, 'MapComponent', this.config.misc.log_pretty_print);
  }

  render() {
    // Generate pseudorandom ID of the div, as the Ionic native plugin does not accept the element object,
    // but just the div id.
    this.mapElementId = 'map' + new Date().getTime();
    this.mapElement = this.element.nativeElement.children[0];
    this.mapElement.setAttribute('id', this.mapElementId);
    let map = new GoogleMap(this.mapElementId);
    // let map = plugin.google.maps.Map.getMap(this.mapElement);
    // map.setDebuggable(true);
  }

  ngOnDestroy() {
    this.logger.debug('Removing the map element along with all the children.');
    while (this.mapElement.firstChild) {
      this.mapElement.removeChild(this.mapElement.firstChild);
    }
  }

}
