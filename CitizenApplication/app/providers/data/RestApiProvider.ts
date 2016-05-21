/**
 * Created by skaldo on 07.05.2016.
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {IUpdateData, IBus, ILine, IRoute, IStop, IBusRealTimeData, IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../model';
import 'rxjs/Rx';
import {ConfigurationService} from '../config/ConfigurationService';

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
        return this.http.get(this.stopsUrl).map(res => {
            return <IRestStops>res.json();
        });
    }

    getUpdateData(): Observable<IUpdateData> {
        return this.http.get(this.updateUrl).map(res => {
            return <IUpdateData>res.json();
        });
    };

    getBusses(): Observable<IRestBusses> {
        return this.http.get(this.bussesUrl).map(res => {
            return <IRestBusses>res.json();
        });
    }

    getLines(): Observable<IRestLines> {
        return this.http.get(this.linesUrl).map(res => {
            return <IRestLines>res.json();
        });
    };

    getRoutes(): Observable<IRestRoutes> {
        return this.http.get(this.routesUrl).map(res => {
            return <IRestRoutes>res.json();
        });
    };

    getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
        return this.http.get(this.rtDataUrl + id).map(res => {
            return <IBusRealTimeData>res.json();
        });
    };

    log(message: string): void {
        console.log('RestApiProvider: ' + message);
    }

    /**
     * @return {host_url}/{busses_suffix}
     */
    get bussesUrl(): string {
        return this.config.restApiConfig.host_url + '/' + this.config.restApiConfig.busses;
    }

    /**
     * @return {host_url}/{lines_suffix}
     */
    get linesUrl(): string {
        return this.config.restApiConfig.host_url + '/' + this.config.restApiConfig.lines;
    }

    /**
     * @return {host_url}/{routes_suffix}
     */
    get routesUrl(): string {
        return this.config.restApiConfig.host_url + '/' + this.config.restApiConfig.routes;
    }

    /**
     * @return {host_url}/{rtData_suffix}
     */
    get rtDataUrl(): string {
        return this.config.restApiConfig.host_url + '/' + this.config.restApiConfig.rt_data;
    }

    /**
     * @return {host_url}/{stops_suffix}
     */
    get stopsUrl(): string {
        return this.config.restApiConfig.host_url + '/' + this.config.restApiConfig.stops;
    }

    /**
     * @return {host_url}/{update_suffix}
     */
    get updateUrl(): string {
        return this.config.restApiConfig.host_url + '/' + this.config.restApiConfig.update;
    }
}