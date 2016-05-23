/**
 * Created by skaldo on 07.05.2016.
 * Reviewed and updated by skaldo on 22.05.2016
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CitizenDataObjects, IUpdateData, IBus, ILine, IRoute, IStop, IBusRealTimeData, IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../model';
import 'rxjs/Rx';
import {ConfigurationService} from '../config/ConfigurationService';

/**
 * Provides access to the rest backend. 
 */
@Injectable()
export class RestApiProvider {

    constructor(private http: Http, private config: ConfigurationService) {

    }

    /**
     * Does nothing
     * @deprecated
     */
    set baseUrl(value: string) {

    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<RestStops>}
     */
    getStops(): Observable<IRestStops> {
        return this.http.get(this.config.getUrl(CitizenDataObjects.Stop)).map(res => {
            return <IRestStops>res.json();
        });
    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<IUpdateData>} resolving into the current IUpdateData of the server
     */
    getUpdateData(): Observable<IUpdateData> {
        return this.http.get(this.config.getUrl(CitizenDataObjects.UpdateData)).map(res => {
            return <IUpdateData>res.json();
        });
    };

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestBusses>} resolving into the current IRestBusses from the server
    */
    getBusses(): Observable<IRestBusses> {
        return this.http.get(this.config.getUrl(CitizenDataObjects.Bus)).map(res => {
            return <IRestBusses>res.json();
        });
    }

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestLines>} resolving into the current IRestLines from the server
    */
    getLines(): Observable<IRestLines> {
        return this.http.get(this.config.getUrl(CitizenDataObjects.Line)).map(res => {
            return <IRestLines>res.json();
        });
    };

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestRoutes>} resolving into the current IRestRoutes from the server
    */
    getRoutes(): Observable<IRestRoutes> {
        return this.http.get(this.config.getUrl(CitizenDataObjects.Route)).map(res => {
            return <IRestRoutes>res.json();
        });
    };

    /**
    * @author skaldo & sholzer
    * @param id : number specifying the bus
    * @returns {Observable<IBusRealTimeData>} resolving into the current IBusRealTimeData of the specified bus from the server
    */
    getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
        return this.http.get(this.config.getUrl(CitizenDataObjects.RealTimeData) + id).map(res => {
            return <IBusRealTimeData>res.json();
        });
    };

    /**
     * Logs Messages for this class to the console: RestApiProvider: {message}
     * @param message :string
     */
    log(message: string): void {
        console.log('RestApiProvider: ' + message);
    };
}
