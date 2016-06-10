/*
 * Created by skaldo on 5.5.2016, added logic for the UI
 */

import {Component} from '@angular/core';
import {Page, NavController, Refresher} from 'ionic-angular';
import {Point, IStop} from '../../providers/model';
import {StopDetailPage} from '../stop-detail/stop-detail';
import {CitizenDataService} from '../../providers/data';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {ViewStop, ViewSchedule} from '../models';
import * as moment from 'moment/moment';

/*
  Generated class for the StopListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/stop-list/stop-list.html',
  providers: [CitizenDataService],
})
export class StopListPage {
  // private searchText: String;
  private stops: Array<ViewStop> = new Array<ViewStop>();
  private logger: Logger;
  constructor(public nav: NavController, private cDS: CitizenDataService, private config: ConfigurationService) {
    this.refreshStops();
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'StopListPage', config.misc.log_pretty_print);
  }

  public onSearch(event) {
    // To-be implemented
  };
  public onSearchCancel(event) {
    // To-be implemented
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
    let observable = this.cDS.getStops();
    this.stops = new Array<ViewStop>();
    observable.subscribe(data => {
      this.logger.debug('Stops recieved');
      data.stops.forEach(stop => {
        this.logger.debug('UI: got stop' + stop.name);
        // faking time in order to prevent errors:
        ;
        this.stops.push(new ViewStop(stop));
      });
    });
    return observable;
  }
}
