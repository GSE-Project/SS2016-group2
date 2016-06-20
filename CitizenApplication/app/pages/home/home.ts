import {Component, ElementRef} from '@angular/core';
import {Page, NavController, Toast} from 'ionic-angular';
import {StopListPage} from '../stop-list/stop-list';
import {BusDetailPage} from '../bus-detail/bus-detail';
import {ConfigurationService} from '../../providers/config';
import {Logger, LoggerFactory} from '../../providers/logger';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private ip: string;
  private reqNumber: number;
  private logger: Logger;
  constructor(private element: ElementRef, public nav: NavController, private config: ConfigurationService) {
    this.reqNumber = 0;
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'HomePage', config.misc.log_pretty_print);
  }

  goToStops() {
    this.nav.push(StopListPage);
  }

  goToBusDetail() {
    this.nav.push(BusDetailPage, { lineId: 1, time: new Date() });
  }

  // hide nav bar when we enter the page
  ionViewWillEnter() {
    var element = <HTMLElement>document.getElementsByTagName('ion-navbar-section')[0];
    element.style.display = 'none';
    this.element.nativeElement.removeAttribute('hidden');
  }

  // show nav bar when we leave the page
  ionViewDidLeave() {
    var element = <HTMLElement>document.getElementsByTagName('ion-navbar-section')[0];
    element.style.display = 'block';
    this.element.nativeElement.setAttribute('hidden');
  }
}