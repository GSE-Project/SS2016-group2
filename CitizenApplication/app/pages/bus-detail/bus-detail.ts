import {Page, NavController, NavParams} from 'ionic-angular';
import {IBus, Bus, IBusRealTimeData} from '../../providers/model';
import {CitizenDataService} from '../../providers/data';
import {Map} from '../../components/map/map';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule} from '../models';

/*
  Generated class for the BusDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/bus-detail/bus-detail.html',
  directives: [Map],
})
export class BusDetailPage {
  private schedule: ViewSchedule;
  private _realTimeData: IBusRealTimeData;
  private busId: number;
  private logger: Logger;

  get realTimeData(): IBusRealTimeData {
    return this._realTimeData;
  }
  set realTimeData(data: IBusRealTimeData) {
    // Do the map update here.
    this._realTimeData = data;
  }
  public bus: Bus = new Bus();
  public busViewType = 'information';

  constructor(public nav: NavController, private navParams: NavParams, private cDS: CitizenDataService, private config: ConfigurationService) {
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
    id = id || this.busId;
    this.cDS.getBusRealTimeData(id).subscribe(data => {
      this.realTimeData = data;
    });
  }

  /**
   * Fetches the bus based on the ID.
   */
  public fetchBus(id?: number) {
    this.cDS.getBusses().subscribe(data => {
      id = id || this.busId;
      this.bus = data.busses.find(bus => {
        return bus.id === id;
      });
    });
  }
}
