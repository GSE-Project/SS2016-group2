/**
 * @author sholzer at 160620
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CitizenApplicationConfig, MiscellaneousConfig, StorageApiConfig, RestApiConfig, RESTAPI_FIELD, STORAGEAPI_FIELD, MISC_FIELD} from './CitizenApplicationConfig';

import {CURRENT_CONFIG} from './CurrentConfig';

export const DEFAULT_CONFIG: CitizenApplicationConfig = {
    rest_api: {
        host_url: 'http://localhost:3000',
        busses: 'busses',
        lines: 'lines',
        routes: 'routes',
        rt_data: 'busses/',
        stops: 'stops',
        update: 'update'
    },
    storage_api: {
        busses: 'B',
        lines: 'L',
        routes: 'R',
        stops: 'S'
    },
    misc: {
        language: 'de'
    }
};


@Injectable()
/**
 * Provides the application with configurations
 * @author sholzer at 160621
 */
export class ConfigurationService {

    private _config: CitizenApplicationConfig = null;

    constructor(private http: Http) {
        this.loadConfig().subscribe(data => {
            console.log('Loaded Config:\n' + JSON.stringify(data));
        });
    }

    /**
     * Access a copy of the rest api configuration
     */
    get restApiConfig(): RestApiConfig {
        return this.getConfigCopy<RestApiConfig>(RESTAPI_FIELD);
    }

    /**
     * Access a copy of the storage api configuration
     */
    get storageApiConfig(): StorageApiConfig {
        return this.getConfigCopy<StorageApiConfig>(STORAGEAPI_FIELD);
    }

    /**
     * Access a copy of the miscellaneous configuration
     */
    get miscConfig(): MiscellaneousConfig {
        return this.getConfigCopy<MiscellaneousConfig>(MISC_FIELD);
    }

    loadConfig(): Observable<any> {
        /*let observable = this.http.get('/config.json')
            .map(res => {
                return <CitizenApplicationConfig>res.json();
            });
        observable.subscribe(data => {
            this._config = data;
            console.log('Config  fetched in ConfigService:\n' + JSON.stringify(data));
        });
        return observable;
        */
        this._config = CURRENT_CONFIG;
        return Observable.of(CURRENT_CONFIG);
    }

    /**
     * Returns a copy of the T configuration in {field}
     * @param field the field identifier of the configuration for T
     * @return {this._config}[field] if not null. DEFAULT_CONFIG[field] otherwise
     */
    private getConfigCopy<T>(field: string): T {
        let config: T = DEFAULT_CONFIG[field];
        if (this._config != null) {
            config = this._config[field];
        } else {
            console.log('Configuration not yet loaded. Return to default');
        }
        return <T>JSON.parse(JSON.stringify(config));
    }
}

