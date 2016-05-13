/**
 * Created by skaldo on 07.05.2016.
 */
import {UpdateData} from "../model/UpdateData";
import {Bus} from "../model/Bus";
import {Line} from "../model/Line";
import {Route} from "../model/Route";
import {Stop} from "../model/Stop";
import {BusRealTimeData} from "../model/BusRealTimeData";
import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import "rxjs/Rx";
import {Observable} from 'rxjs/Observable';
import {RestStops} from "../model/rest/RestStops";
import {RestBusses} from "../model/rest/RestBusses";
import {RestLines} from "../model/rest/RestLines";
import {RestRoutes} from "../model/rest/RestRoute";

// skaldo:
// Eventuell könnten wir es dem constructor übergeben.
// Mal sehen, wie wir es mit der Injection schaffen werden.
const BUSSES = "busses";
const LINES = "lines";
const STOPS = "stops";
const ROUTES = "routes";
const UPDATE = "update";

@Injectable()
export class RestApiProvider {
    set baseUrl(value:string) {
        this._baseUrl = value;
    }

    private _baseUrl = 'http://localhost:3000/';

    constructor(private http:Http) {
    }

   /* getRemoteDataArray<T extends CitizenDataServiveObject>(type:string, constructingClass:{ new ():T }):Promise<{ timestamp:number, data:T[] }> {
        return new Promise<{ timestamp:number, data:T[] }>((resolve, reject) => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    debugger;
                    if (!data) {
                        reject("No data returned.");
                    }
                    else if (!data[type]) {
                        reject("The returned object does not have " + type + " property.");
                    }
                    data[type].forEach(item => new constructingClass().fromJSON(item));
                    resolve({timestamp: data.timestamp, data: data[type]});
                });
        });
    }

    getRemoteData<T extends CitizenDataServiveObject>(type:string, constructingClass:{ new ():T }):Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.http.get(baseUrl + type)
                .map(res => res.json())
                .subscribe(data => {
                    debugger;
                    if (!data) {
                        reject("No data returned.");
                    }
                    var ret = new constructingClass().fromJSON(data);
                    resolve(ret);
                });
        });
    }*/

    /**
     * @author skaldo & sholzer
     * @returns {Observable<RestStops>}
     */
    getStops(): Observable<RestStops> {
        return this.http.get(this._baseUrl+STOPS)
            .map(res => {
                return res.json();
            });
        //return observable;
    }

    getUpdateData():Observable<UpdateData> {
        return this.http.get(this._baseUrl+UPDATE).map(res => {
                return <UpdateData> res.json();
        });
    };

    getBusses():Observable<RestBusses> {
        return this.http.get(this._baseUrl+BUSSES).map(res => {
            return <RestBusses> res.json();
        });
    }

    getLines():Observable<RestLines> {
        return this.http.get(this._baseUrl+LINES).map(res => {
            return <RestLines> res.json();
        });
    };

    getRoutes():Observable<RestRoutes> {
        return this.http.get(this._baseUrl+ROUTES).map(res => {
            return <RestRoutes> res.json();
        });
    };

    getRealTimeBusData(id:number):Observable<BusRealTimeData> {
        return this.http.get(this._baseUrl+BUSSES+"/"+id).map(res => {
            return <BusRealTimeData> res.json();
        });
    };
}