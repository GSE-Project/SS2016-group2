import {Page, NavController} from 'ionic-angular';
import {ViewChild} from  '@angular/core';
import {Map} from '../../components/map/map';

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
  @ViewChild(Map) map: Map;
  constructor(public nav: NavController) {
  }
  centerMap() {
    this.map.centerMap();
  }

  addMarker(pos, name) {
    this.map.addMarker(pos, name);
  }
}
