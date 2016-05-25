/*
 * Created by skaldo on 5.5.2016, added logic for the UI
 */

import {Page, NavController, Refresher} from 'ionic-angular';
import {Point, IStop} from '../../providers/model';
import {StopDetailPage} from '../stop-detail/stop-detail';
import {CitizenDataService} from '../../providers/data';

class ViewStop implements IStop {
  public name: string;
  public location: Point;
  public schedule: { lineId: number; time: Date }[];
  public id: number;
  private lines: Array<number>;

  constructor(stop: IStop) {
    this.id = stop.id;
    this.location = stop.location;
    this.name = stop.name;
    this.schedule = stop.schedule;
    this.lines = Array<number>();
    let linesHelper = [];

    // Do the sorting & get the lines of the stop.
    this.schedule.sort((a, b) => {
      linesHelper[a.lineId] = true;
      linesHelper[b.lineId] = true;
      return a.time.getTime() - b.time.getTime();
    });

    linesHelper.forEach((value, index) => {
      if (value) {
        this.lines.push(index);
      }
    });

    this.lines.sort((a, b) => {
      return b - a;
    });
  }

  public getSchedules(first: number) {
    return this.schedule.slice(0, first);
  }

  public getLines() {
    return this.lines;
  }
}

/*
  Generated class for the StopListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/stop-list/stop-list.html',
  providers: [CitizenDataService],
})
export class StopListPage {
  // private searchText: String;
  private stops: Array<ViewStop> = new Array<ViewStop>();
  constructor(public nav: NavController, private cDS: CitizenDataService) {
    this.refreshStops();
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
      this.log('Stops recieved');
      data.stops.forEach(stop => {
        this.log('UI: got stop' + stop.name);
        // faking time in order to prevent errors:
        stop.schedule.forEach(item => {
          item.time = this.getRandomTime();
        });
        this.stops.push(new ViewStop(stop));
      });
    });
    return observable;
  }

  private log(message: string): void {
    console.log('StopListPage: ' + message);
  }
}
