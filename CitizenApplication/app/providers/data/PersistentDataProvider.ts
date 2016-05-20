/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 */

import {Injectable} from '@angular/core';
import {Page, Storage, LocalStorage, Toast, NavController} from 'ionic-angular';
import {IRestStops, IRestBusses, IRestLines, IRestRoutes, IUpdateData} from '../model';
import {Observable} from 'rxjs/Observable';

const STORAGE_ACTIVE = 'A';
const STORAGE_TIMESTAMP = 'T';
const STORAGE_BUS = 'B';
const STORAGE_LINE = 'L';
const STORAGE_STOP = 'S';
const STORAGE_ROUTE = 'R';


@Injectable()
export class PersistentDataProvider {
    public storage: Storage;

    constructor() {
        // Currently we use LocalStorage. Maybe in a later implementation switch to SqlStorage
        this.storage = new Storage(LocalStorage);
    }

    /**
     * Sets the used Storage api. Mainly for testing purposes
     * @author sholzer 160516
     * @param storage Object implementing the Storage interface
     */
    setStorage(storage: Storage): void {
        this.storage = storage;
    }

    /**
     * Get the stops from the Storage
     * @returns Observable<IRestStops>
     */
    getStops(): Observable<IRestStops> {
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_STOP)).map(
            data => {
                return <IRestStops>JSON.parse(data);
            });
    }

    /**
     * Save the stops in the storage
     * @param data Array of stops
     */
    putStops(data: IRestStops) {
        this.storage.set(STORAGE_STOP, JSON.stringify(data));
    }

    /**
     * Get the busses from the storage
     * @returns Observable<IRestBusses>
     */
    getBusses(): Observable<IRestBusses> {
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_BUS)).map(
            data => {
                return <IRestBusses>JSON.parse(data);
            });
    }

    /**
     * Save the busses in the storage
     * @param data Array of busses (IRestBusses)
     */
    putBusses(data: IRestBusses) {
        this.storage.set(STORAGE_BUS, JSON.stringify(data));
    }

    /**
     * Get the lines from the storage
     * @returns Observable<IRestLines>
     */
    getLines(): Observable<IRestLines> {
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_LINE)).map(
            data => {
                return <IRestLines>JSON.parse(data);
            });
    }

    /**
     * Save the lines in the storage
     * @param data Array of lines (IRestLines)
     */
    putLines(data: IRestLines) {
        this.storage.set(STORAGE_LINE, JSON.stringify(data));
    }

    /**
     * Get the routes from the storage
     * @returns Observable<IRestRoutes>
     */
    getRoutes(): Observable<IRestRoutes> {
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_ROUTE)).map(
            data => {
                return <IRestRoutes>JSON.parse(data);
            });
    }

    /**
     * Save the routes in the storage
     * @param data Array of routes (IRestRoutes)
     */
    putRoutes(data: IRestRoutes) {
        this.storage.set(STORAGE_ROUTE, JSON.stringify(data));
    }
}