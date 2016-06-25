/**
 * Created by skaldo
 * Edited by sholzer on the 14.06.2016
 * Reviewed by skaldo on the 14.06.2016 - looks good after #84
 * Added #85, available seats by tim284 on the 16.06.2016
 * Reviewed by skaldo on the 18.06.2016 - some minor changes done. OK.
 */
import {NavController, NavParams} from 'ionic-angular';
import {ViewBus} from '../models';
import {TransformationService} from '../../providers/transformation';
import {Component, ViewChild} from  '@angular/core';
import {NativeMap} from '../../components/native-map/native-map';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule, ViewBusRealTimeData} from '../models';
import {GoogleMapsLatLng} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/bus-detail/bus-detail.html',
  directives: [NativeMap],
})
export class BusDetailPage {
  public bus: ViewBus;
  private schedule: ViewSchedule;
  private logger: Logger = new LoggerFactory().getLogger(this.config.misc.log_level, 'BusDetailPage', this.config.misc.log_pretty_print);
  private busId: number;
  private _realTimeData: ViewBusRealTimeData;
  private _busViewType = 'information';
  private _updateInterval = 1000; // Update interval in ms.
  private _updateIdentifier: NodeJS.Timer;
  private _markerSet: boolean = false;
  @ViewChild(NativeMap) map: NativeMap;

  get realTimeData(): ViewBusRealTimeData {
    return this._realTimeData;
  }
  set realTimeData(data: ViewBusRealTimeData) {
    // Do the map update here.
    this._realTimeData = data;
  }


  get busViewType() {
    return this._busViewType;
  }
  set busViewType(data: string) {
    this._busViewType = data;
    if (data === 'position') {/*
      // HACK! Quick n' dirty
      setTimeout(() => {
        this.map.render();
        let latLng = new google.maps.LatLng(this.realTimeData.position.coordinates[0], this.realTimeData.position.coordinates[1]);
        // this.map.addBusMarker(latLng, this.bus.numberPlate);
      }, 1000);*/
    }
  }

  constructor(public nav: NavController, private navParams: NavParams, private dataAccess: TransformationService, private config: ConfigurationService) {
    this.schedule = navParams.data;
    // Caution, change this to the bus ID in the next iteration.
    this.busId = this.schedule.lineId;
    this.fetchBus();
    this.fetchBusRealTimeData();
  }

  /**
   * Fetches the realtime information of bus.
   * Call periodically.
   */
  public fetchBusRealTimeData(id?: number) {
    if (!id) {
      id = this.busId;
    }
    this.logger.debug('Accessing RealTimeData for id ' + id);
    this.dataAccess.getBusRealTimeData(id).subscribe(data => {
      this.realTimeData = data;
      this.logger.debug('BRTD Access done');
      this._updateIdentifier = setTimeout(() => {
        this.fetchBusRealTimeData(id);
      }, this._updateInterval);
      if (!this.map) {
        return;
      }
      let pos = new GoogleMapsLatLng(data.position.coordinates[1], data.position.coordinates[0]);
      this.map.setCenter(pos, 18);
      if (!this._markerSet) {
        this.map.addMarker('bus', 'red', pos);
        return;
      }
      this.map.moveMarker('bus', 'red', pos);
    });
  }

  /**
   * Make sure that nothing occurs when the user left the page.
   */
  ionViewDidLeave() {
    clearTimeout(this._updateIdentifier);
  }

  /**
   * Fetches the bus based on the ID.
   */
  public fetchBus(id?: number) {
    if (!id) {
      id = this.busId;
    }
    this.logger.debug('Accessing Busses from DataLogic: id = ' + id);
    this.dataAccess.getBusses(String(id)).subscribe(data => {
      if (data.length > 0) {
        this.bus = new ViewBus(data[0]);
        this.logger.debug('Bus Access done');
      }
    });
  }
}
