import {Page, NavController, NavParams, ActionSheet} from 'ionic-angular';
import {IStop} from '../../providers/model/Stop';
import {BusDetailPage} from '../bus-detail/bus-detail';

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
  constructor(public nav: NavController, private navParams: NavParams) {
    this.stop = navParams.data;
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
            this.nav.push(BusDetailPage);
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
