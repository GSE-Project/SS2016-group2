import {Component} from '@angular/core';
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
  constructor(public nav: NavController, private config: ConfigurationService) {
    this.reqNumber = 0;
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'HomePage', config.misc.log_pretty_print);

    // app was updated, we need to delete our (possible) outdated data or we are in devMode.
    if (!config.version.release || config.version.build_number !== localStorage.getItem('app_version')) {
      if (!config.version.release) {
        this.logger.info('LocalStorage cleared, developmentMode found');
      }
      else {
        this.logger.info('LocalStorage cleared, stored Version: ' + localStorage.getItem('app_version') + ', configVersion: ' + config.version.build_number);
      }

      localStorage.clear();
      localStorage.setItem('app_version', config.version.build_number);
    }
    // App was never started before, so we need to set 'app_version'
    else if (localStorage.getItem('app_version') == null) {
      this.logger.debug('Set app Version to: ' + config.version.build_number);
      localStorage.setItem('app_version', config.version.build_number);
    }
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
  }

  // show nav bar when we leave the page
  ionViewDidLeave() {
    var element = <HTMLElement>document.getElementsByTagName('ion-navbar-section')[0];
    element.style.display = 'block';
  }
}