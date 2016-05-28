/**
 * Log:
 * Created by skaldo on 07.05.2016.
 * Reviewed and updated by skaldo on 22.05.2016
 * Updated by sholzer on the 28.05.2016 - added generic method
 * Reviewed by skaldo on the 28.05.2016 - OK
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CitizenDataObjects, IUpdateData, IBus, ILine, IRoute, IStop, IBusRealTimeData, IRestStops, IRestBusses, IRestLines, IRestRoutes, IRestDataObject} from '../model';
import 'rxjs/Rx';
import {ConfigurationService} from '../config';
import {Logger, LoggerFactory} from '../logger';

/**
 * Provides access to the rest backend. 
 */
@Injectable()
export class RestApiProvider {

    private logger: Logger;

    constructor(private http: Http, private config: ConfigurationService) {
        this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'RestApiProvider', config.misc.log_pretty_print);
    }

    /**
     * Does nothing
     * @deprecated
     */
    set baseUrl(value: string) {

    }

    /**
     * Return a data object from the rest server
     * @param data: CitizenDataObjects specifying the object to be returned. 
     * @return Observable<T>
     */
    getData<T>(data: CitizenDataObjects): Observable<T> {
        return this.http.get(this.config.getUrl(data)).map(
            res => {
                return <T>res.json();
            }
        );
    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<RestStops>}
     */
    getStops(): Observable<IRestStops> {
        return this.getData<IRestStops>(CitizenDataObjects.Stop);
    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<IUpdateData>} resolving into the current IUpdateData of the server
     */
    getUpdateData(): Observable<IUpdateData> {
        return this.getData<IUpdateData>(CitizenDataObjects.UpdateData);
    };

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestBusses>} resolving into the current IRestBusses from the server
    */
    getBusses(): Observable<IRestBusses> {
        return this.getData<IRestBusses>(CitizenDataObjects.Bus);
    }

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestLines>} resolving into the current IRestLines from the server
    */
    getLines(): Observable<IRestLines> {
        return this.getData<IRestLines>(CitizenDataObjects.Line);
    };

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestRoutes>} resolving into the current IRestRoutes from the server
    */
    getRoutes(): Observable<IRestRoutes> {
        return this.getData<IRestRoutes>(CitizenDataObjects.Route);
    };

    /**
    * @author skaldo & sholzer
    * @param id : number specifying the bus
    * @returns {Observable<IBusRealTimeData>} resolving into the current IBusRealTimeData of the specified bus from the server
    */
    getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
        return this.getData<IBusRealTimeData>(CitizenDataObjects.RealTimeData);
    };
}
