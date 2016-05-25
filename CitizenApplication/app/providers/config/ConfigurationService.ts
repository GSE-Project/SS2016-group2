/**
 * @author sholzer at 160620
 * Reviewed and updated by skaldo on 22.05.2016
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CitizenApplicationConfig, MiscellaneousConfig, StorageApiConfig, RestApiConfig, RESTAPI_FIELD, STORAGEAPI_FIELD, MISC_FIELD} from './';
import {CitizenDataObjects} from '../model';

interface CitizenWindow extends Window { citizenConfig: CitizenApplicationConfig; }
declare var window: CitizenWindow;

/**
 * A default Configuration to prevent null pointers in the Service
 */
export const DEFAULT_CONFIG = <CitizenApplicationConfig>{
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
        language: 'de',
        log_level: 'debug',
        log_pretty_print: false
    }
};


@Injectable()
/**
 * Provides the application with configurations
 * @author sholzer at 160621
 */
export class ConfigurationService {

    /**
     * The current used configuration
     */
    private _config: CitizenApplicationConfig = null;

    constructor(private http: Http) {
        if (!window.citizenConfig) {
            console.log('Config: no config found, using the default one.');
            window.citizenConfig = DEFAULT_CONFIG;
        }
        this._config = window.citizenConfig;
    }

    /**
     * Access a copy of the rest api configuration
     */
    get restApi(): RestApiConfig {
        return this.get<RestApiConfig>(RESTAPI_FIELD);
    }

    /**
     * Access a copy of the storage api configuration
     */
    get storageApi(): StorageApiConfig {
        return this.get<StorageApiConfig>(STORAGEAPI_FIELD);
    }

    /**
     * Access a copy of the miscellaneous configuration
     */
    get misc(): MiscellaneousConfig {
        return this.get<MiscellaneousConfig>(MISC_FIELD);
    }

    /**
     * Access a copy of the url configuration
     */
    getUrl(type: CitizenDataObjects): string {
        let url = this.restApi.host_url + '/';
        switch (type) {
            case CitizenDataObjects.Bus:
                url += this.restApi.busses;
                break;
            case CitizenDataObjects.Line:
                url += this.restApi.lines;
                break;
            case CitizenDataObjects.RealTimeData:
                url += this.restApi.rt_data;
                break;
            case CitizenDataObjects.Route:
                url += this.restApi.routes;
                break;
            case CitizenDataObjects.Stop:
                url += this.restApi.stops;
                break;
            case CitizenDataObjects.UpdateData:
                url += this.restApi.update;
                break;
            default:
                return null;
        }
        return url;
    }

    /**
     * Returns a copy of the T configuration in {field}
     * @param field the field identifier of the configuration for T
     * @return {this._config}[field] if not null. DEFAULT_CONFIG[field] otherwise
     */
    private get<T>(field: string): T {
        let config: T = DEFAULT_CONFIG[field];
        if (this._config != null) {
            config = this._config[field];
        } else {
            console.log('Configuration not yet loaded. Return to default');
        }
        return <T>JSON.parse(JSON.stringify(config));
    }
}

