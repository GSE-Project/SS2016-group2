import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {RestApiProvider} from './providers/data/RestApiProvider';
import {PersistentDataProvider} from './providers/data/PersistentDataProvider';
import {CitizenDataService} from './providers/data/CitizenDataService';
import {ConfigurationService} from './providers/config/ConfigurationService';
/* // Currently not used since it doesn't work at all (#41)
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from '@angular/router-deprecated';
import {CustomRouterOutlet} from './shared/directives/custom-router-outlet';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
*/

@App({
  template: '<!-- custom-router-outlet></custom-router-outlet --><ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [CitizenDataService, RestApiProvider,
    PersistentDataProvider, ConfigurationService/*, ROUTER_PROVIDERS,provide(APP_BASE_HREF, {useValue:'/'})*/],
  /*directives: [ROUTER_DIRECTIVES, CustomRouterOutlet],*/
})
export class MyApp {
  public rootPage: any = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
