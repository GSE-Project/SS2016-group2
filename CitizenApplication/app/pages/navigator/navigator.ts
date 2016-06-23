/**
 * Created by mmueller on the XX.05.2016.
 * Edited by skaldo on 09.05.2016.
 * Added i18n support by tim284 on the 28.05.2016
 * Reviewed by skaldo on the 29.05.2016 - inject pipe application-wide, restructured a bit.
 */
import {Page, NavController, Popover, ViewController, NavParams} from 'ionic-angular';
import {Component, ViewChild} from  '@angular/core';
import {Map} from '../../components/map/map';
import {TransformationService} from '../../providers/transformation';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule} from '../models';

@Component({
  templateUrl: 'build/pages/navigator/navigator.html',
  directives: [Map]
})
export class NavigatorPage {
  private logger: Logger;
  public searchQuery: string;
  private showingResults: boolean = false;
  public stops: Array<ViewStop>;

  @ViewChild(Map) map: Map;
  constructor(public nav: NavController, private config: ConfigurationService, private dataAccess: TransformationService) {
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'NavigatorPage', config.misc.log_pretty_print);
    this.resetFiler();
  }
  centerMap() {
    this.map.centerMap();
  }

  addMarker(pos, name) {
    this.map.addMarker(pos, name);
  }

  closeResultsOverlay() {
    this.showingResults = false;
  }

  showResultsOverlay() {
    this.showingResults = true;
    this.getItems();
  }

  getItems() {
    this.dataAccess.getStops(this.searchQuery).subscribe((data) => {
      this.stops = data;
      data.forEach((stop) => {
        this.map.addMarker(new google.maps.LatLng(stop.location.coordinates[1], stop.location.coordinates[0]), stop.name);
      });
    });
  }

  resetFiler() {
    this.searchQuery = '';
    this.getItems();
  }

  markerClicked(markerObj: { name: string, marker: google.maps.Marker }) {
    this.resetFiler();
    let stop = this.stops.find(predicate => predicate.name === markerObj.name);
    this.stopClicked(stop);
  }

  mapClicked(position: google.maps.LatLng) {
    this.map.addMarker(position, 'Custom Location');
    this.map.centerMap(position, 18);
    let popover = Popover.create(StopPopoverPage, { location: location });
    this.nav.present(popover, {
      ev: {
        target: {
          // Little bit of faking
          getBoundingClientRect: function () {
            return { left: document.documentElement.clientWidth / 2, top: document.documentElement.clientHeight / 2 };
          }
        }
      },
    });
    popover.onDismiss(() => {
      this.map.deleteMarker('Custom Location');
    });
  }

  stopClicked(stop: ViewStop) {
    this.closeResultsOverlay();
    // Fix of an Android bug, we have to hide keyboard before we create the popover.
    setTimeout(() => {
      this.map.centerMap(new google.maps.LatLng(stop.location.coordinates[1], stop.location.coordinates[0]), 18);
      this.map.addMarker(new google.maps.LatLng(stop.location.coordinates[1], stop.location.coordinates[0]), stop.name);
      let popover = Popover.create(StopPopoverPage, { stop: stop });
      this.nav.present(popover, {
        ev: {
          target: {
            // Little bit of faking
            getBoundingClientRect: function () {
              return { left: document.documentElement.clientWidth / 2, top: document.documentElement.clientHeight / 2 };
            }
          }
        },
      });
    }, 200);
    this.resetFiler();
  }
}

@Component({
  template: `
    <ion-list>
      <ion-list-header>{{stop.name}}</ion-list-header>
      <button ion-item (click)="close()">Request stop</button>
      <ion-item (click)="close()">Close</ion-item>
    </ion-list>
  `
})
class StopPopoverPage {
  public stop: ViewStop;
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.stop = this.navParams.data.stop;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
