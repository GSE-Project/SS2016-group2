/**
 * Created by skaldo on 07.05.2016.
 */

import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {IUpdateData, IBus, ILine, IRoute, IStop, IBusRealTimeData, IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../model';
import 'rxjs/Rx';

// skaldo:
// Eventuell könnten wir es dem constructor übergeben.
// Mal sehen, wie wir es mit der Injection schaffen werden.
const BUSSES = 'busses';
const LINES = 'lines';
const STOPS = 'stops';
const ROUTES = 'routes';
const UPDATE = 'update';

@Injectable()
export class RestApiProvider {
    private _baseUrl = 'http://' + window.location.hostname + ':3000/';

    constructor(private http: Http) {
    }

    // TODO: Comment.
    set baseUrl(value: string) {
        this._baseUrl = value;
    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<RestStops>}
     */
    getStops(): Observable<IRestStops> {
        return this.http.get(this._baseUrl + STOPS).map(res => {
            return <IRestStops>res.json();
        });
    }

    getUpdateData(): Observable<IUpdateData> {
        return this.http.get(this._baseUrl + UPDATE).map(res => {
            return <IUpdateData>res.json();
        });
    };

    getBusses(): Observable<IRestBusses> {
        return this.http.get(this._baseUrl + BUSSES).map(res => {
            return <IRestBusses>res.json();
        });
    }

    getLines(): Observable<IRestLines> {
        return this.http.get(this._baseUrl + LINES).map(res => {
            return <IRestLines>res.json();
        });
    };

    getRoutes(): Observable<IRestRoutes> {
        return this.http.get(this._baseUrl + ROUTES).map(res => {
            return <IRestRoutes>res.json();
        });
    };

    getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
        return this.http.get(this._baseUrl + BUSSES + '/' + id).map(res => {
            return <IBusRealTimeData>res.json();
        });
    };

    log(message: string): void {
        console.log('RestApiProvider: ' + message);
    }
}