/**
 * @author sholzer at 160620
 * Reviewed and updated by skaldo on 22.05.2016
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CitizenApplicationConfig, MiscellaneousConfig, VersionConfig, StorageApiConfig, RestApiConfig, RESTAPI_FIELD, STORAGEAPI_FIELD, MISC_FIELD, VERSION_FIELD} from './';
import {CitizenDataObjects} from '../model';
import {Logger, LoggerFactory} from '../logger';

interface CitizenWindow extends Window { citizenConfig: CitizenApplicationConfig; }
declare var window: CitizenWindow;

/**
 * A default Configuration to prevent null pointers in the Service
 */
const DEFAULT_CONFIG: CitizenApplicationConfig = {
    rest_api: {
        host_url: 'http://localhost:3000',
        busses: 'busses',
        lines: 'lines',
        routes: 'routes',
        rt_data: 'busses/',
        stops: 'stops',
        update: 'update',
        request: 'CustomStops',
        post_request: 'CustomStops'
    },
    storage_api: {
        busses: 'B',
        citizen_data: 'C',
        lines: 'L',
        routes: 'R',
        stops: 'S',
        request: 'Q'
    },
    misc: {
        language: 'de',
        log_level: 'debug',
        log_pretty_print: false
    },
    version: {
        build_number: 'DEFAULT_CONFIG',
        commit: 'DEFAULT_CONFIG',
        release: false
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
    private logger: Logger;

    constructor(private http: Http) {
        this.logger = new LoggerFactory().getLogger('info', 'ConfigurationService', false);
        if (!window.citizenConfig) {
            this.logger.warn('Config: no config found, using the default one.');
            window.citizenConfig = ConfigurationService.DEFAULT_CONFIG;
        }
        this._config = window.citizenConfig;
        this.logger = new LoggerFactory().getLogger(this._config.misc.log_level, 'ConfigurationService', this._config.misc.log_pretty_print);
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

    get version(): VersionConfig {
        return this.get<VersionConfig>(VERSION_FIELD);
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
            case CitizenDataObjects.GetRequest:
                url += this.restApi.request;
            case CitizenDataObjects.PostRequest:
                url += this.restApi.post_request;
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
            this.logger.warn('Configuration not yet loaded. Return to default');
        }
        return <T>JSON.parse(JSON.stringify(config));
    }

    static get DEFAULT_CONFIG() {
        return DEFAULT_CONFIG;
    }
}

