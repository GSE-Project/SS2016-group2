import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ViewController, Modal, NavParams, Popover} from 'ionic-angular';
import {ViewRequest, ViewLine} from '../models';
import {NativeMap, GoogleMapsLatLng} from '../../components/native-map/native-map';
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

  set position(pos: GoogleMapsLatLng) {
    this.requestObj.location.coordinates[1] = pos.lat;
    this.requestObj.location.coordinates[0] = pos.lng;
  }

  get position(): GoogleMapsLatLng {
    return new GoogleMapsLatLng(this.requestObj.location.coordinates[0], this.requestObj.location.coordinates[1]);
  }

  constructor(private element: ElementRef, public nav: NavController, public viewCtrl: ViewController, private model_access: TransformationService) {
    model_access.getLines().subscribe(res => {
      this.linesList = res;
    });
  }

  selectLineChanged(selectedLine) {
    this.requestObj.lineId = selectedLine.id;
  }

  showMap() {
    let customStopPopoverPage = Modal.create(CustomStopPopoverPage, { data: { location: this.position } });
    this.nav.present(customStopPopoverPage);
    this.element.nativeElement.setAttribute('hidden', '');
    // TODO: improve, it's a hack
    document.getElementsByTagName('ion-navbar-section')[0].setAttribute('hidden', '');
    customStopPopoverPage.onDismiss((position) => {
      this.element.nativeElement.removeAttribute('hidden');
      document.getElementsByTagName('ion-navbar-section')[0].removeAttribute('hidden');
      this.position = position;
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
  directives: [NativeMap]
})
class CustomStopPopoverPage {
  public position: GoogleMapsLatLng;

  @ViewChild(NativeMap) map: NativeMap;
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.position = this.navParams.data.location;
    /*
    setTimeout(() => {
      this.map.createMap();
      this.map.centerMap(this.position);
    }, 250);
    */
  }

  ngAfterViewInit() {
    if (!this.position) {
      this.map.centerCamera();
      return;
    }
    this.map.setCenter(this.position, 18);
  }

  submit() {
    this.viewCtrl.dismiss(this.position);
  }

  mapClicked(position: GoogleMapsLatLng) {
    this.map.deleteMarker('Custom Location');
    this.map.addMarker('Custom Location', 'yellow', position);
    this.map.setCenter(position, 18);
    this.position = position;
  }

  ionViewDidLeave() {
    // Disable map.
    this.map.suspend(true);
  }

  ionViewDidEnter() {
    // Enable map.
    this.map.suspend(false);
  }

}