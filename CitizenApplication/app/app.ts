/**
 * Created by skaldo on the initial commit
 * Added i18n support by tim284 on the 28.05.2016
 * Reviewed by skaldo on the 29.05.2016 - inject pipe application-wide, restructured a bit.
 * Merged by skaldo on the 04.06.2016
 */
import {ionicBootstrap, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Component, Provider, provide, PLATFORM_PIPES} from '@angular/core';
import {Http} from '@angular/http';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate';
import {TabsPage} from './pages/tabs/tabs';
import {RestApiProvider, PersistentDataProvider, CitizenDataService} from './providers/data';
import {ConfigurationService} from './providers/config';
import {IStorage, InjectableLocalStorage} from './providers/storage';
import {TransformationService} from './providers/transformation';


@Component({
  template: '<!-- custom-router-outlet></custom-router-outlet --><ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  public rootPage: any = TabsPage;
  constructor(platform: Platform, private translate: TranslateService) {
    translate.use('de');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

// Pass the main app component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument:
// http://ionicframework.com/docs/v2/api/config/Config/

ionicBootstrap(MyApp, [
    provide(TranslateLoader, {
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'lang', '.json'),
      deps: [Http]
    }),
    provide(PLATFORM_PIPES, {useValue: [TranslatePipe], multi: true}),
    new Provider(IStorage, { useClass: InjectableLocalStorage }),
    TranslateService, CitizenDataService, RestApiProvider, PersistentDataProvider, ConfigurationService, TransformationService], {
  tabbarPlacement: 'bottom'
});
