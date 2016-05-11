/**
* Created by skaldo on 07.05.2016.
*/
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import {JsonParsable} from '../model/JsonParsable';
import {UpdateData} from '../model/UpdateData';
import {Bus} from '../model/Bus';
import {Line} from '../model/Line';
import {Route} from '../model/Route';
import {Stop} from '../model/Stop';
import {BusRealTimeData}  from '../model/BusRealTimeData';
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

    getRemoteDataArray<T extends JsonParsable>(type: string, constructingClass: { new (): T }): Promise<{ timestamp: number, data: T[] }> {
        return new Promise<{ timestamp: number, data: T[] }>(resolve => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    data[type].forEach(item => new constructingClass().fromJSON(item));
                    resolve({ timestamp: data.timestamp, data: data[type] });
                });
        });
    }

    getRemoteData<T extends JsonParsable>(type: string, constructingClass: { new (): T }): Promise<T> {
        return new Promise<T>(resolve => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    var ret = new constructingClass().fromJSON(data);
                    resolve(ret);
                });
        });
    }

    getUpdateDataFromServer(): Promise<UpdateData> {
        return this.getRemoteData<UpdateData>(UPDATE, UpdateData);
    };
    getBussesFromServer(): Promise<{ timestamp: number, data: Bus[] }> {
        return this.getRemoteDataArray<Bus>(BUSSES, Bus);
    };
    getLinesFromServer(): Promise<{ timestamp: number, data: Line[] }> {
        return this.getRemoteDataArray<Line>(LINES, Line);
    };
    getStopsFromServer(): Promise<{ timestamp: number, data: Stop[] }> {
        return this.getRemoteDataArray<Stop>(STOPS, Stop);
    };
    getRoutesFromServer(): Promise<{ timestamp: number, data: Route[] }> {
        return this.getRemoteDataArray<Route>(ROUTES, Route);
    };
    getRealTimeBusData(id: number): Promise<BusRealTimeData> {
        return this.getRemoteData<BusRealTimeData>(BUSSES + "/" + id, BusRealTimeData);
    };
}