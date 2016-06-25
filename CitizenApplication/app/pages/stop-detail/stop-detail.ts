import {Component, ElementRef} from '@angular/core';
import {Page, NavController, NavParams, ActionSheet} from 'ionic-angular';
import {ViewStop} from '../models';
import {BusDetailPage} from '../bus-detail/bus-detail';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';
import {TranslateService} from 'ng2-translate/ng2-translate';

/*
  Generated class for the StopDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/stop-detail/stop-detail.html',
})
export class StopDetailPage {
  private stop: ViewStop;
  private logger: Logger;
  constructor(private element: ElementRef, public nav: NavController, private navParams: NavParams, private config: ConfigurationService, private translate: TranslateService) {
    this.stop = navParams.data;
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'StopDetailPage', config.misc.log_pretty_print);
  }

  infoClicked(schedule) {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: this.translate.instant('STOP_DETAIL_PAGE.RequestStop'),
          handler: () => {
          }
        }, {
          text: this.translate.instant('STOP_DETAIL_PAGE.ShowBusInfo'),
          handler: () => {
            this.nav.push(BusDetailPage, schedule);
          }
        }, {
          text: this.translate.instant('C.Cancel'),
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }

  ionViewWillEnter() {
    this.element.nativeElement.removeAttribute('hidden');
  }

  ionViewDidLeave() {
    this.element.nativeElement.setAttribute('hidden', '');
  }
}
