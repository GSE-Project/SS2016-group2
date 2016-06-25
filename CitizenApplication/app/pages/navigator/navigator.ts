/**
 * Created by mmueller on the XX.05.2016.
 * Edited by skaldo on 09.05.2016.
 * Added i18n support by tim284 on the 28.05.2016
 * Reviewed by skaldo on the 29.05.2016 - inject pipe application-wide, restructured a bit.
 */
import {Page, NavController, Popover, ViewController, NavParams} from 'ionic-angular';
import {Component, ViewChild} from  '@angular/core';
import {NativeMap} from '../../components/native-map/native-map';
import {TransformationService} from '../../providers/transformation';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule} from '../models';
import {GoogleMapsLatLng} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/navigator/navigator.html',
  directives: [NativeMap]
})
export class NavigatorPage {
  private logger: Logger;
  public searchQuery: string;
  private showingResults: boolean = false;
  public stops: Array<ViewStop>;

  @ViewChild(NativeMap) map: NativeMap;
  constructor(public nav: NavController, private config: ConfigurationService, private dataAccess: TransformationService) {
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'NavigatorPage', config.misc.log_pretty_print);
    this.resetFiler();
  }

  ngAfterViewInit() {
    if (!this.stops) {
      return;
    }
    this.stops.forEach((stop) => {
      this.map.addMarker(stop.name, 'blue', new GoogleMapsLatLng(stop.location.coordinates[1], stop.location.coordinates[0]));
    });
  }

  centerMap() {
    this.map.centerCamera();
  }

  addMarker(name: string, color: string, pos: GoogleMapsLatLng) {
    this.map.addMarker(name, color, pos);
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
        this.map.addMarker(stop.name, 'blue', new GoogleMapsLatLng(stop.location.coordinates[1], stop.location.coordinates[0]));
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

  mapClicked(position: GoogleMapsLatLng) {
    this.map.addMarker('Custom Location', 'yellow', position);
    let mockStop = new ViewStop({
      id: -1,
      location: { type: 'Point', coordinates: [position.lng, position.lat] },
      name: 'Custom Location',
      schedule: [],
      lines: []
    });
    this.stopClicked(mockStop);
  }

  stopClicked(stop: ViewStop) {
    this.closeResultsOverlay();
    // Fix of an Android bug, we have to hide keyboard before we create the popover.
    setTimeout(() => {
      let pos = new GoogleMapsLatLng(stop.location.coordinates[1], stop.location.coordinates[0]);
      this.map.setCenter(pos, 18);
      let popover = Popover.create(StopPopoverPage, { stop: stop });
      this.map.setClickable(false);
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
        this.map.setClickable(true);
        if (stop.id === -1) {
          this.map.deleteMarker(stop.name);
        }
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
