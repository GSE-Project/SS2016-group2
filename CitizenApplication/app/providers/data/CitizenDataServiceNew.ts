import { Observable }     from 'rxjs/Observable';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {BusRealTimeData}  from '../model/BusRealTimeData';
import {Bus} from '../model/Bus';
import {Line} from '../model/Line';
import {Stop} from '../model/Stop';
import {Route} from '../model/Route';
import {Point} from '../model/geojson/Point';
//import {RestApiProvider} from "./RestApiProvider";
//import {PersistentDataProvider} from "./PersistentDataProvider";
import {UpdateData} from "../model/UpdateData";
import {timeInterval} from "rxjs/operator/timeInterval";
import {Page, Storage, LocalStorage, Toast, NavController} from 'ionic-angular';

// TODO: Add interfaces for other types..
// We might not need any classes for this..
interface IStops {
    timestamp: number,
    stops: Stop[]
}

@Injectable()
export class RestApiProvider {
    constructor(private http: Http) {
    }

    // TODO: Please add support for other methods.
    getStops(): Observable<IStops> {
        var observable = this.http.get("http://localhost:3000/stops")
            .map(res => {
                // Do some parsing, casting to objects,...
                // But not in this iteration I'd say..
                return res.json();
            });
        return observable;
    }
}

@Injectable()
export class PersistentDataProvider {
    public storage: Storage;

    constructor() {
        // Currently we use LocalStorage. Maybe in a later implementation switch to SqlStorage
        this.storage = new Storage(LocalStorage);
    }

    // TODO: Please add support for other methods.
    // The type of the promise seems to do the casting already :)
    getStops(): Promise<Stop[]> {
        return new Promise<Stop[]>(resolve => {
            this.storage.get("STOP");
        });
    }

    // TODO: Please add support for other methods.
    putStops(stops: Stop[]) {
        this.storage.set("STOP", JSON.stringify(stops))
    }
}

interface ITimeStamps {
    // Add the other possible timestamps.
    stops: number
}

@Injectable()
export class CitizenDataService {
    // Object containing the timestamps.
    private timestamps: ITimeStamps = {
        stops: 0
    }

    constructor(private restApi: RestApiProvider, private storageApi: PersistentDataProvider) {
    }

    // TODO: Please add support for other methods.
    getStops() {
        var stopsObservable: Observable<IStops>;
        var currentTime = new Date().getTime();
        if (this.timestamps.stops < currentTime) {
            // Get new data from the server.
            stopsObservable = this.restApi.getStops();
            stopsObservable.subscribe(data => {
                // save the timestamp.
                this.timestamps.stops = data.timestamp;
                // save the data.
                this.storageApi.putStops(data.stops);
            });
        }
        else {  // TODO: next iterations, fetching from the
            // LocalStorage based on the timestamps.
            // Not tested yet.
            stopsObservable = new Observable<IStops>();
            this.storageApi.getStops().then(stops => {
                stopsObservable.do(x => {
                    x.stops = stops;
                    x.timestamp = this.timestamps.stops;
                });
            })
        }

        // pass the observable to the UI.
        return stopsObservable;
    }
}
