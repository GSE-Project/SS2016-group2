/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 */

import {Injectable} from 'angular2/core';
import {Page, Storage, LocalStorage, Toast, NavController} from 'ionic-angular';
import {IRestStops, IRestBusses, IRestLines, IRestRoutes, IUpdateData} from "../model";
import {Observable} from "rxjs/Observable";

const STORAGE_ACTIVE = "A";
const STORAGE_TIMESTAMP = "T";
const STORAGE_BUS = "B";
const STORAGE_LINE = "L";
const STORAGE_STOP = "S";
const STORAGE_ROUTE = "R";


@Injectable()
export class PersistentDataProvider {
    public storage: Storage;
    private storedTimeStamps: IUpdateData;

    constructor() {
        // Currently we use LocalStorage. Maybe in a later implementation switch to SqlStorage
        this.storage = new Storage(LocalStorage);
        this.storedTimeStamps = { // Instantiation with timestamp:-1 seems more stable
			busses: -2,
			lines: -2,
			routes: -2,
			stops: -2
		};
    }

    /**
     * Get the timestamps of the stored data
     * @returns IUpdateData
     */
    getTimeStamps(): IUpdateData {
        return this.storedTimeStamps;
    }

    // TODO: comment.
    getStops(): Observable<IRestStops> {
        return Observable.fromPromise(<Promise<IRestStops>>this.storage.get(STORAGE_STOP));
    }

    // TODO: comment.
    putStops(data: IRestStops) {
        this.storage.set(STORAGE_STOP, JSON.stringify(data)).then(value => {
            // After successful save, save the timestamp.
            this.storedTimeStamps.stops = data.timestamp;
        });
    }

    // TODO: comment.
    getBusses(): Observable<IRestBusses> {
        return Observable.fromPromise(<Promise<IRestBusses>>this.storage.get(STORAGE_BUS));
    }

    // TODO: comment.
    putBusses(data: IRestBusses) {
        this.storage.set(STORAGE_BUS, JSON.stringify(data)).then(value => {
            // After successful save, save the timestamp.
            this.storedTimeStamps.busses = data.timestamp;
        });
    }

    // TODO: comment.
    getLines(): Observable<IRestLines> {
        return Observable.fromPromise(<Promise<IRestLines>>this.storage.get(STORAGE_LINE));
    }

    // TODO: comment.
    putLines(data: IRestLines) {
        this.storage.set(STORAGE_LINE, JSON.stringify(data)).then(value => {
            // After successful save, save the timestamp.
            this.storedTimeStamps.lines = data.timestamp;
        });
    }

    // TODO: comment.
    getRoutes(): Observable<IRestRoutes> {
        return Observable.fromPromise(<Promise<IRestRoutes>>this.storage.get(STORAGE_ROUTE));
    }

    // TODO: comment.
    putRoutes(data: IRestRoutes) {
        this.storage.set(STORAGE_ROUTE, JSON.stringify(data)).then(value => {
            // After successful save, save the timestamp.
            this.storedTimeStamps.routes = data.timestamp;
        });
    }
}