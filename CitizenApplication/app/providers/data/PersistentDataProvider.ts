/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 * Reviewed and updated by skaldo on 22.05.2016
 */

import {Injectable} from '@angular/core';
import {IStorage} from '../storage';
import {IRestDataObject, IRestStops, IRestBusses, IRestLines, IRestRoutes, IUpdateData} from '../model';
import {Observable} from 'rxjs/Observable';
import {ConfigurationService} from '../config';
import {Logger, LoggerFactory} from '../logger';

@Injectable()
export class PersistentDataProvider {

    private logger: Logger;

    constructor(private config: ConfigurationService, private storage: IStorage) {
        this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'PersistentDataProvider', config.misc.log_pretty_print);
    }

    /**
     * Sets the used Storage api. Mainly for testing purposes
     * @author sholzer 160516
     * @param storage Object implementing the Storage interface
     * @deprecated
     */
    setStorage(storage: Storage): void {
    }

    getData<T extends IRestDataObject>(key: string): Observable<T> {
        return Observable.fromPromise(<Promise<string>>this.storage.get(key)).map(
            data => {
                return <T>JSON.parse(data);
            }
        );
    }

    putData<T extends IRestDataObject>(key: string, data: T): void {
        this.storage.set(key, JSON.stringify(data));
    }

    /**
     * Get the stops from the Storage
     * @returns Observable<IRestStops>
     */
    getStops(): Observable<IRestStops> {
        return this.getData<IRestStops>(this.config.storageApi.stops);
    }

    /**
     * Save the stops in the storage
     * @param data Array of stops
     */
    putStops(data: IRestStops) {
        this.putData<IRestStops>(this.config.storageApi.stops, data);
    }

    /**
     * Get the busses from the storage
     * @returns Observable<IRestBusses>
     */
    getBusses(): Observable<IRestBusses> {
        return this.getData<IRestBusses>(this.config.storageApi.busses);

    }

    /**
     * Save the busses in the storage
     * @param data Array of busses (IRestBusses)
     */
    putBusses(data: IRestBusses) {
        this.putData<IRestBusses>(this.config.storageApi.busses, data);
    }

    /**
     * Get the lines from the storage
     * @returns Observable<IRestLines>
     */
    getLines(): Observable<IRestLines> {
        return this.getData<IRestLines>(this.config.storageApi.lines);
    }

    /**
     * Save the lines in the storage
     * @param data Array of lines (IRestLines)
     */
    putLines(data: IRestLines) {
        this.putData<IRestLines>(this.config.storageApi.lines, data);
    }

    /**
     * Get the routes from the storage
     * @returns Observable<IRestRoutes>
     */
    getRoutes(): Observable<IRestRoutes> {
        return this.getData<IRestRoutes>(this.config.storageApi.routes);
    }

    /**
     * Save the routes in the storage
     * @param data Array of routes (IRestRoutes)
     */
    putRoutes(data: IRestRoutes) {
        this.putData<IRestRoutes>(this.config.storageApi.routes, data);
    }
}