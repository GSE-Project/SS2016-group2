import { Component, ElementRef } from '@angular/core';
import { NavController, Refresher, ActionSheet } from 'ionic-angular';
import {ViewRequestState, ViewRequestStates} from '../models';
import {TransformationService} from '../../providers/transformation';
import {TranslateService} from 'ng2-translate';

@Component({
  templateUrl: 'build/pages/requests/requests.html',
})
export class RequestsPage {
  private requests: Array<ViewRequestState>;
  // The length or ! check does not work in the template :/
  private empty: boolean;
  private update: boolean = true;
  public timeout: number = 10000;
  constructor(private element: ElementRef, private nav: NavController, private dataAccess: TransformationService, private translate: TranslateService) {
    this.doRefresh();
  }

  public doRefresh(refresher?: Refresher) {
    this.dataAccess.getRequests().subscribe((reqs: Array<ViewRequestState>) => {
      this.requestsReceived(reqs);
      if (refresher) {
        refresher.complete();
      }
    });
  }

  ionRequestActionSheet(request: ViewRequestState) {
    this.translate.getTranslation(this.translate.currentLang).subscribe(res => {
      let text = res.REQUESTS_PAGE;
      let actionSheet = ActionSheet.create({
        title: text.ASTitle,
        buttons: [
          {
            text: text.ASCancelRequest,
            role: 'destructive',
            handler: () => {
              this.dataAccess.cancelRequest(request.id);
              this.requests = this.requests.filter(
                item => item.id === request.id ? false : true
              );
            }
          }, {
            text: text.ASBack,
            role: 'cancel',
            handler: () => { }
          }
        ],
        enableBackdropDismiss: true
      });
      this.nav.present(actionSheet);
    });
  }

  ionViewWillEnter() {
    this.update = true;
    this.updateStates();
    this.element.nativeElement.removeAttribute('hidden');
  }

  ionViewDidLeave() {
    this.update = false;
    this.element.nativeElement.setAttribute('hidden', '');
  }

  requestsReceived(reqs: Array<ViewRequestState>) {
    this.empty = true;
    this.requests = reqs.filter(item => { // We don't care for already completed requests
      if (ViewRequestStates[item.state] > 3) {
        return false;
      }
      this.empty = false;
      return true;
    });
  }

  updateStates() {
    this.dataAccess.getRequests().subscribe((reqs: Array<ViewRequestState>) => {
      this.requestsReceived(reqs);
      if (this.update) {
        setTimeout(() => {
          this.updateStates();
        }, this.timeout);
      }
    });
  }
}
