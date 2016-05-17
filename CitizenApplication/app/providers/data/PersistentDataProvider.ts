/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 */

import {Injectable} from 'angular2/core';
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
    private storedTimeStamps: IUpdateData;
    private _isReady: boolean = false;
    private _waitForObservable: Observable<any> = null;

    constructor() {
        // Currently we use LocalStorage. Maybe in a later implementation switch to SqlStorage
        this.storage = new Storage(LocalStorage);
        this.storedTimeStamps = { // Instantiation with timestamp:-1 seems more stable
            busses: -2,
            lines: -2,
            routes: -2,
            stops: -2
        };
        this.waitForReady().subscribe(res => { this._isReady = true; });
    }

    /**
     * Gets the timestamps from the localstorage.
     * It is intended to call this function to get
     * the data from the localstorage on the 1st run.
     */
    private updateTimeStamps(): Observable<any> {
        let busObserver = this.getBusses();
        busObserver.subscribe(data => {
            if (data) {
                this.storedTimeStamps.busses = data.timestamp;
            }
        });
        let linesObserver = this.getLines();
        linesObserver.subscribe(data => {
            if (data) {
                this.storedTimeStamps.lines = data.timestamp;
            }
        });
        let routesObserver = this.getRoutes();
        routesObserver.subscribe(data => {
            if (data) {
                this.storedTimeStamps.routes = data.timestamp;
            }
        });
        let stopsObserver = this.getStops();
        stopsObserver.subscribe(data => {
            if (data) {
                this.storedTimeStamps.stops = data.timestamp;
            }
        });

        return new Observable(() => { }).merge([busObserver, linesObserver, routesObserver, stopsObserver]);
    }

    /**
     * State of the PersistentDataProvider
     * @return true iff the stored timestamps could be fetched. false otherwise
     */
    isReady(): boolean {
        return this._isReady;
    }

    waitForReady(): Observable<any> {
        if (this._isReady) {
            return Observable.of(true);
        }
        if (this._waitForObservable == null) {
            this._waitForObservable = this.updateTimeStamps();
        }
        // I added the map since no external observer needs to know what exactly is resolved here.
        return this._waitForObservable.map(res => true);
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
     * Get the timestamps of the stored data
     * @returns IUpdateData
     */
    getTimeStamps(): IUpdateData {
        return this.storedTimeStamps;
    }

    // TODO: comment.
    getStops(): Observable<IRestStops> {
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_STOP)).map(
            data => {
                return <IRestStops>JSON.parse(data);
            });
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
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_BUS)).map(
            data => {
                return <IRestBusses>JSON.parse(data);
            });
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
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_LINE)).map(
            data => {
                return <IRestLines>JSON.parse(data);
            });
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
        return Observable.fromPromise(<Promise<string>>this.storage.get(STORAGE_ROUTE)).map(
            data => {
                return <IRestRoutes>JSON.parse(data);
            });
    }

    // TODO: comment.
    putRoutes(data: IRestRoutes) {
        this.storage.set(STORAGE_ROUTE, JSON.stringify(data)).then(value => {
            // After successful save, save the timestamp.
            this.storedTimeStamps.routes = data.timestamp;
        });
    }
}