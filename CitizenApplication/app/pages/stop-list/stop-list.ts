/*
 * Created by skaldo on 5.5.2016, added logic for the UI
 */

import {Page, NavController} from 'ionic-angular';
import {Point} from '../../providers/model/geojson/Point';
import {StopDetailPage} from '../stop-detail/stop-detail';
import {CitizenDataService} from '../../providers/data/CitizenDataService';
import {IStop} from "../../providers/model/Stop";

class ViewStop implements IStop {
  name:string;
  location:Point;
  schedule:{lineId:number; time:Date}[];
  id:number;
  private lines: Array<number>;



  constructor(stop: IStop) {

    this.id = stop.id;
    this.location = stop.location;
    this.name = stop.name;
    this.schedule = stop.schedule;

    this.lines = Array<number>();
    var linesHelper = [];

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
    })
  }

  getSchedules(first: number) {
    return this.schedule.slice(0, first);
  }

  getLines() {
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
  providers: [CitizenDataService]
})
export class StopListPage {
  private searchText: String;
  private stops: Array<ViewStop> = new Array<ViewStop>();
  constructor(public nav: NavController, private cDS: CitizenDataService) {
    this.cDS.getStops().subscribe(data => {
      this.log("Stops recieved");
      data.stops.forEach(stop => {
        console.log("UI: got stop" + stop.name);
        //faking time in order to prevent errors:
        stop.schedule.forEach(item => {
          item.time = this.getRandomTime();
        });
        this.stops.push(new ViewStop(stop));
      });
    })
    /*
    this.cDS.getStopList().forEach(stop => {
      this.stops.push(new ViewStop(stop));
    });
    
    /*
    for (let i = 0; i < 50; i++) {
      var stop = new Stop();
      stop.id = i;
      stop.name = "Straße " + i;
      stop.location = new Point(99, 12);

      stop.schedule = [];
      for (let i = 0; i < 8; i++) {
        stop.schedule.push({ lineId: this.getRandomLine(), time: this.getRandomTime() });
      }

      this.stops.push(new ViewStop(stop));
    }*/
  }

  onSearch(event) {

  }
  onSearchCancel(event) {

  }

  getRandomTime() {
    var time = new Date();
    var minutes = time.getMinutes();
    minutes = + Math.floor(Math.random() * (60 - 0));
    time.setMinutes(minutes);
    return time;
  }

  getRandomLine() {
    return Math.floor(Math.random() * (3 + 1)) + 1;
  }

  goToStopDetail(stop: IStop) {
    this.nav.push(StopDetailPage, stop);
  }
  log(message:string):void{
		console.log("StopListPage: "+message);
	}
}
