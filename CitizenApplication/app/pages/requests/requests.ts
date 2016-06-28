import { Component, ElementRef } from '@angular/core';
import { NavController, Refresher } from 'ionic-angular';
import {ViewRequestState} from '../models';
import {TransformationService} from '../../providers/transformation';

/*
  Generated class for the RequestsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/requests/requests.html',
})
export class RequestsPage {
  private requests: Array<ViewRequestState>;
  // The length or ! check does not work in the template :/
  private empty: boolean;
  constructor(private element: ElementRef, private nav: NavController, private dataAccess: TransformationService) {
    this.doRefresh();
  }

  public doRefresh(refresher?: Refresher) {
    this.dataAccess.getRequests().subscribe((reqs: Array<ViewRequestState>) => {
      this.empty = false;
      if (reqs.length === 0) {
        this.empty = true;
      }
      this.requests = reqs;
      if (refresher) {
        refresher.complete();
      }
    });
  }

  ionViewWillEnter() {
    this.element.nativeElement.removeAttribute('hidden');
  }

  ionViewDidLeave() {
    this.element.nativeElement.setAttribute('hidden', '');
  }
}
