/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 * Reviewed and updated by skaldo on 22.05.2016
 */

import {Injectable} from '@angular/core';
import {IStorage} from '../storage';
import {IRestDataObject, IRestStops, IRestBusses, IRestLines, IRestRoutes, IUpdateData, IRequestState, IRequestResponse, RequestStates, ICitizenData} from '../model';
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

    addRequest(req: IRequestResponse) {
        this.getRequests().subscribe(res => {
            let newRequest: IRequestState = {
                id: req.id,
                state: RequestStates.Pending
            };
            res.push(newRequest);
            this.storage.set(this.config.storageApi.request, JSON.stringify(res));
        });
    }

    /**
     * @param item :IRequestState
     * @return true iff the item isn't Completed
     */
    private request_filter(item: IRequestState) {
        if (item.state === RequestStates.Completed) {
            return false;
        }
        return true;
    }

    getRequests(): Observable<IRequestState[]> {
        return Observable.from(this.storage.get(this.config.storageApi.request)).map<IRequestState[]>(res => {
            return (<IRequestState[]>JSON.parse(res)).filter(this.request_filter);
        });
    }

    updateRequest(req: IRequestState) {
        this.getRequests().subscribe(res => {
            let sameIdItems = res.filter(item => (item.id === req.id ? true : false));
            switch (sameIdItems.length) {
                case 0:
                    this.logger.warn('Did not found RequestStates with the specified id ' + req.id);
                    break;
                default:
                    this.logger.warn('Inconsistent Database! Two request state items with the same ID found!');
                case 1:
                    res[res.indexOf(sameIdItems[0])].state = req.state;
                    this.logger.debug('State of Request ' + req.id + ' set to ' + req.state);
            }
            this.storage.set(this.config.storageApi.request, JSON.stringify(res));
        });
    }

    /**
     * Puts the CitizenData to the storage
     */
    putCitizenData(cd: ICitizenData) {
        let cd_json = JSON.stringify(cd);
        this.logger.debug('putting ' + cd_json);
        this.storage.set(this.config.storageApi.citizen_data, cd_json);
    }

    /**
     * Gets the CitizenData
     */
    getCitizenData(): Observable<ICitizenData> {
        return Observable.from(this.storage.get(this.config.storageApi.citizen_data)).map<ICitizenData>(res => {
            return JSON.parse(res);
        });
    }

}