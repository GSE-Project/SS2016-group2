import {Component, ViewChild} from '@angular/core';
import {NavController, ViewController, Modal, NavParams, Popover} from 'ionic-angular';
import {ViewRequest, ViewLine} from '../models';
import {Map} from '../../components/map/map';
import {TransformationService} from '../../providers/transformation';
import * as moment from 'moment/moment';

/*
  Generated class for the RequestStopPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/request-stop/request-stop.html'
})
export class RequestStopPage {
  public requestObj: ViewRequest = new ViewRequest();
  public selectedLine: string = '';
  public linesList: ViewLine[] = [];

  set pickUpTime(time: string) {
    this.requestObj.pickUpTime = new Date(time);
  }

  get pickUpTime(): string {
    return this.requestObj.pickUpTime.toISOString();
  }

  constructor(public nav: NavController, public viewCtrl: ViewController, private model_access: TransformationService) {
    model_access.getLines().subscribe(res => {
      this.linesList = res;
    });
  }

  selectLineChanged(selectedLine) {
    this.requestObj.lineId = selectedLine.id;
  }

  showMap() {
    let customStopPopoverPage = Modal.create(CustomStopPopoverPage, { data: { location: this.requestObj.location } });
    this.nav.present(customStopPopoverPage);
    customStopPopoverPage.onDismiss((position) => {
      this.requestObj.location = position;
    });
  }

  submit() {
    // TODO: validation - add method validate to the ViewRequest class.
    this.model_access.makeRequest(this.requestObj);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }
}

@Component({
  templateUrl: 'build/pages/request-stop/request-stop-overlay.html',
  directives: [Map]
})
class CustomStopPopoverPage {
  public position: google.maps.LatLng;

  @ViewChild(Map) map: Map;
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.position = this.navParams.data.location;
    setTimeout(() => {
      this.map.createMap();
      this.map.centerMap(this.position);
    }, 250);
  }

  submit() {
    this.viewCtrl.dismiss(this.position);
  }

  mapClicked(position: google.maps.LatLng) {
    this.map.deleteMarker('Custom Location');
    this.map.addMarker(position, 'Custom Location');
    this.map.centerMap(position, 18);
    this.position = position;
  }
}