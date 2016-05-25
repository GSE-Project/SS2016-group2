import {Page, NavController} from 'ionic-angular';
import {ViewChild} from  '@angular/core';
import {Map} from '../../components/map/map';
import {Logger, LoggerFactory} from '../../providers/logger/Logger';

/*
  Created by mmueller on the XX.05.2016.
  Edited by skaldo on 09.05.2016.
  
  This is the controller of the map page.  
*/

@Page({
  templateUrl: 'build/pages/map/map.html',
  directives: [Map],
})
export class MapPage {

  private logger: Logger;

  @ViewChild(Map) map: Map;
  constructor(public nav: NavController, private loggerFactory: LoggerFactory) {
    this.logger = this.loggerFactory.getLogger('MapPage');
  }
  centerMap() {
    this.map.centerMap();
  }

  addMarker(pos, name) {
    this.map.addMarker(pos, name);
  }
}
