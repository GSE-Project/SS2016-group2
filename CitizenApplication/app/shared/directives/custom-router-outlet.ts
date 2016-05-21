import {Directive, Attribute, ElementRef, DynamicComponentLoader} from '@angular/core';
import {Router, RouterOutlet, ComponentInstruction} from '@angular/router';
import {ConfigurationService} from '../../providers/config/ConfigurationService';
@Directive({
    selector: 'custom-router-outlet'
})
export class CustomRouterOutlet extends RouterOutlet {
    publicRoutes: any;
    private parentRouter: Router;
    constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader,
        _parentRouter: Router, @Attribute('name') nameAttr: string, private _config: ConfigurationService) {
        super(_elementRef, _loader, _parentRouter, nameAttr);
        this.parentRouter = _parentRouter;
    }
    activate(instruction: ComponentInstruction) {
        return this._config.loadConfig().subscribe(() => { return super.activate(instruction) });
    }
}