/*
 * Created by skaldo on 5.5.2016, added logic for the UI
 */

import {Page, NavController, Refresher} from 'ionic-angular';
import {Point, IStop} from '../../providers/model';
import {StopDetailPage} from '../stop-detail/stop-detail';
import {TransformationService} from '../../providers/transformation';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule} from '../models';
import * as moment from 'moment/moment';

/*
  Generated class for the StopListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/stop-list/stop-list.html',
  providers: [TransformationService],
})
export class StopListPage {
  // private searchText: String;
  private allStops: Array<ViewStop> = new Array<ViewStop>();
  private stops: Array<ViewStop> = new Array<ViewStop>();
  private logger: Logger;
  private searchText: string;
  constructor(public nav: NavController, private dataAccess: TransformationService, private config: ConfigurationService) {
    this.refreshStops();
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'StopListPage', config.misc.log_pretty_print);
  }

  public onSearch(event) {
    this.logger.debug('Filtering list for ' + this.searchText);
    this.stops = this.allStops.filter(this.dataAccess.getFilter<ViewStop>(this.searchText));
  };
  public onSearchCancel(event) {
    this.stops = this.allStops;
  };

  public doRefresh(refresher: Refresher) {
    this.refreshStops().subscribe(data => {
      refresher.complete();
    });
  }

  public getRandomTime() {
    let time = new Date();
    let minutes = time.getMinutes();
    minutes = + Math.floor(Math.random() * (60 - 0));
    time.setMinutes(minutes);
    return time;
  }

  public getRandomLine() {
    return Math.floor(Math.random() * (3 + 1)) + 1;
  }

  public goToStopDetail(stop: IStop) {
    this.nav.push(StopDetailPage, stop);
  }

  private refreshStops() {
    let observable = this.dataAccess.getStops();
    observable.subscribe((data) => {
      this.logger.debug('Fetched stops');
      this.allStops = data;
      this.stops = data;
      data.forEach((item) => {
        this.logger.debug('Fetched Stop ' + item.id + ':' + item.name);
      });
    });
    return observable;
  }
}
