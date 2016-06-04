import {Page, NavController, NavParams, ActionSheet} from 'ionic-angular';
import {IStop} from '../../providers/model';
import {BusDetailPage} from '../bus-detail/bus-detail';
import {Logger, LoggerFactory} from '../../providers/logger';
import {ConfigurationService} from '../../providers/config';

/*
  Generated class for the StopDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/stop-detail/stop-detail.html',
})
export class StopDetailPage {
  private stop: IStop;
  private logger: Logger;
  constructor(public nav: NavController, private navParams: NavParams, private config: ConfigurationService) {
    this.stop = navParams.data;
    this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'StopDetailPage', config.misc.log_pretty_print);
  }

  infoClicked(schedule) {
    let actionSheet = ActionSheet.create({
      title: 'Tasks',
      buttons: [
        {
          text: 'Request a stop',
          handler: () => {
          }
        }, {
          text: 'Show bus information',
          handler: () => {
            this.nav.push(BusDetailPage, schedule);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }
}
