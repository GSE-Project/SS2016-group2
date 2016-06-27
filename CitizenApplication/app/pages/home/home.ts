import {Component, ElementRef} from '@angular/core';
import {Page, NavController, Toast, Modal} from 'ionic-angular';
import {StopListPage} from '../stop-list/stop-list';
import {RequestsPage} from '../requests/requests';
import {RequestStopPage} from '../request-stop/request-stop';
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

  requestStop() {
    let requestStopModal = Modal.create(RequestStopPage);
    this.element.nativeElement.setAttribute('hidden', '');
    this.nav.present(requestStopModal);
    requestStopModal.onDismiss(() => {
      this.element.nativeElement.removeAttribute('hidden');
    });
  }

  goToRequests() {
    this.nav.push(RequestsPage);
  }

  ionViewWillEnter() {
    this.element.nativeElement.removeAttribute('hidden');
  }

  ionViewDidLeave() {
    this.element.nativeElement.setAttribute('hidden', '');
  }
}
