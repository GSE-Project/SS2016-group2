import {NavController, NavParams} from 'ionic-angular';
import {ViewBus} from '../models';
import {TransformationService} from '../../providers/transformation';
import {Component, ViewChild} from  '@angular/core';
import {Map} from '../../components/map/map';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule, ViewBusRealTimeData} from '../models';

/*
  Generated class for the BusDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/bus-detail/bus-detail.html',
  directives: [Map],
})
export class BusDetailPage {
  private schedule: ViewSchedule;
  private _realTimeData: ViewBusRealTimeData;
  private busId: number;
  private logger: Logger;

  get realTimeData(): ViewBusRealTimeData {
    return this._realTimeData;
  }
  set realTimeData(data: ViewBusRealTimeData) {
    // Do the map update here.
    this._realTimeData = data;
  }
  public bus: ViewBus;
  private _busViewType = 'information';

  get busViewType() {
    return this._busViewType;
  }
  set busViewType(data: string) {
    this._busViewType = data;
    if (data === 'position') {
      // HACK! Quick n' dirty
      setTimeout(() => {
        let latLng = new google.maps.LatLng(this.realTimeData.position.coordinates[0], this.realTimeData.position.coordinates[1]);
        this.map.addBusMarker(latLng, this.bus.numberPlate);
      }, 1000);
    }
  }

  @ViewChild(Map) map: Map;
  constructor(public nav: NavController, private navParams: NavParams, private dataAccess: TransformationService, private config: ConfigurationService) {
    this.schedule = navParams.data;
    // Caution, change this to the bus ID in the next iteration.
    this.busId = this.schedule.lineId;
    this.fetchBus();
    this.fetchBusRealTimeData();
    // Start some update interval for the posititon of the bus.
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'BusDetailPage', config.misc.log_pretty_print);
  }

  /**
   * Fetches the realtime information of bus.
   * Call periodically.
   */
  public fetchBusRealTimeData(id?: number) {
    if (!id) {
      id = this.busId;
    }
    this.dataAccess.getBusRealTimeData(id).subscribe(data => {
      this.realTimeData = data;
    });
  }

  /**
   * Fetches the bus based on the ID.
   */
  public fetchBus(id?: number) {
    if (!id) {
      id = this.busId;
    }
    this.dataAccess.getBusses(String(id)).subscribe(data => {
      if (data.length > 0) {
        this.bus = data[0];
      }
    });
  }
}
