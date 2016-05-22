import {Directive, Attribute, ViewContainerRef, DynamicComponentLoader} from '@angular/core';
import {Router, RouterOutlet, ComponentInstruction} from '@angular/router-deprecated';
import { ConfigurationService } from '../../providers/config/ConfigurationService';
@Directive({
  selector: 'custom-router-outlet'
})
export class CustomRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;
  constructor(_viewContainerRef: ViewContainerRef, _loader: DynamicComponentLoader,
    _parentRouter: Router, @Attribute('name') nameAttr: string, private _config: ConfigurationService) {
    super(_viewContainerRef, _loader, _parentRouter, nameAttr);
    this.parentRouter = _parentRouter;
    console.log('custom-router called');
  }
  activate(instruction: ComponentInstruction) {
    return this._config.loadConfig().toPromise().then(() => { return super.activate(instruction) });
  }
}