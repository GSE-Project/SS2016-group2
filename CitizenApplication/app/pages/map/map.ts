/**
 * Created by mmueller on the XX.05.2016.
 * Edited by skaldo on 09.05.2016.
 * Added i18n support by tim284 on the 28.05.2016
 * Reviewed by skaldo on the 29.05.2016 - inject pipe application-wide, restructured a bit.
 */
import {Page, NavController} from 'ionic-angular';
import {ViewChild} from  '@angular/core';
import {Map} from '../../components/map/map';

@Page({
  templateUrl: 'build/pages/map/map.html',
  directives: [Map]
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
