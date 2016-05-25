import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {RestApiProvider, PersistentDataProvider, CitizenDataService} from './providers/data';
import {ConfigurationService} from './providers/config';
import {LoggerFactory} from './providers/logger';

@App({
  template: '<!-- custom-router-outlet></custom-router-outlet --><ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [CitizenDataService, RestApiProvider,
    PersistentDataProvider, ConfigurationService, LoggerFactory],
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
