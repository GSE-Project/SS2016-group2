import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {provide} from '@angular/core';
import {Http} from '@angular/http';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate';
import {TabsPage} from './pages/tabs/tabs';
import {RestApiProvider} from './providers/data/RestApiProvider';
import {PersistentDataProvider} from './providers/data/PersistentDataProvider';
import {CitizenDataService} from './providers/data/CitizenDataService';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [provide(TranslateLoader, {
useFactory: (http: Http) => new TranslateStaticLoader(http, 'lang', '.json'),
deps: [Http]
}), TranslateService, CitizenDataService, RestApiProvider, PersistentDataProvider],
})
export class MyApp {
  public rootPage: any = TabsPage;
  translate: TranslateService;
  constructor(platform: Platform, translate: TranslateService) {
    this.translate = translate;
    translate.use('de');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
