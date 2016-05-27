import {Page, NavController} from 'ionic-angular';
import {ViewChild} from  '@angular/core';
import {Map} from '../../components/map/map';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';

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
  constructor(public nav: NavController, private config: ConfigurationService) {
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'MapPage', config.misc.log_pretty_print);
  }
  centerMap() {
    this.map.centerMap();
  }

  addMarker(pos, name) {
    this.map.addMarker(pos, name);
  }
}
