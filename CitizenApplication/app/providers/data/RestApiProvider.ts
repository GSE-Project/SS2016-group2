/**
* Created by skaldo on 07.05.2016.
*/
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import {UpdateData} from '../model/UpdateData';
import {Bus} from '../model/Bus';
import {Line} from '../model/Line';
import {Route} from '../model/Route';
import {Stop} from '../model/Stop';
import {Point} from '../model/geojson/Point';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/Rx';

// skaldo:
// Eventuell könnten wir es dem constructor übergeben.
// Mal sehen, wie wir es mit der Injection schaffen werden.
const baseUrl = 'http://localhost:3000';
const BUSSES = "busses";
const LINES = "lines";
const STOPS = "stops";
const ROUTES = "routes";
const UPDATE = "update";

@Injectable()
export class RestApiProvider implements RestApiProviderInterface {
    constructor(public http: Http) { }

    getRemoteDataArray<T>(type: string): Promise<{timestamp: number, data: T[]}> {
        return new Promise<{timestamp: number, data: T[]}>(resolve => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    // by sholzer at 160510, 12:17
                    var result : {timestamp:number, data:T[]}= <{timestamp:number, data:T[]}> JSON.parse(data);
                    // TODO: parsing
                    // data[type].forEach(item => new T().fromJSON(data));
                    // resolve({timestamp: data.timestamp, data: data[type]});
                    resolve(result);
                });
        });
    }

    getRemoteData<T>(type: string): Promise<T> {
        return new Promise<T>(resolve => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    // TODO: parsing
                    // var ret = new T().fromJSON(data);
                    // resolve(ret);
                    // by sholzer at 160510, 12:17
                    resolve(<T>JSON.parse(data));
                });
        });
    }

    getUpdateDataFromServer(): Promise<UpdateData> {
        return this.getRemoteData<UpdateData>(UPDATE);
    };
    getBussesFromServer(): Promise<{timestamp: number, data: Bus[]}> {
        return this.getRemoteDataArray<Bus>(BUSSES);
    };
    getLinesFromServer(): Promise<{timestamp: number, data: Line[]}> {
        return this.getRemoteDataArray<Line>(LINES);
    };
    getStopsFromServer(): Promise<{timestamp: number, data: Stop[]}> {
        return this.getRemoteDataArray<Stop>(STOPS);
    };
    getRoutesFromServer(): Promise<{timestamp: number, data: Route[]}> {
        return this.getRemoteDataArray<Route>(ROUTES);
    };
    getRealTimeBusData(id: number): Promise<{ position: Point, delay: number }> {
        return this.getRemoteData<{ position: Point, delay: number }>(BUSSES + "/" + id);
    };
}