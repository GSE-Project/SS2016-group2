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

@Injectable()
export class RestApiProvider implements RestApiProviderInterface {
    constructor(public http: Http) { }

    getRemoteData<T>(type: string): Promise<T> {
        return new Promise<T>(resolve => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    getUpdateDataFromServer(): Promise<UpdateData> {
        return this.getRemoteData<UpdateData>("update");
    };
    getBussesFromServer(): Promise<Bus[]> {
        return this.getRemoteData<Bus[]>("busses");
    };
    getLinesFromServer(): Promise<Line[]> {
        return this.getRemoteData<Line[]>("lines");
    };
    getStopsFromServer(): Promise<Stop[]> {
        return this.getRemoteData<Stop[]>("stops");
    };
    getRoutesFromServer(): Promise<Route[]> {
        return this.getRemoteData<Route[]>("routes");
    };
    getRealTimeBusData(id: number): Promise<{ position: Point, delay: number }> {
        return this.getRemoteData<{ position: Point, delay: number }>("busses/" + id);
    };
}