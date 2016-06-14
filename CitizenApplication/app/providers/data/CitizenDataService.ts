/**
 * Log:
 * Created by sholzer on the 3.5.2016
 * Reviewed by skaldo on the 6.5.2016
 * Updated by skaldo & sholzer on the 13.05.2016
 * Updated by skaldo on the 14.05.2016 - adjusted to match the tslint rules.
 * Updated by sholzer on the 28.05.2016 - added generic method
 * Reviewed by skaldo on the 28.05.2016 - OK
 */

import {Injectable} from '@angular/core';
import {RestApiProvider} from './RestApiProvider';
import * as Model from '../model';
import {PersistentDataProvider} from './PersistentDataProvider';
import {Observable} from 'rxjs/Observable';
import {Logger, LoggerFactory} from '../logger/Logger';
import {IBusRealTimeData, IUpdateData, IRestStops, IRestBusses, IRestLines, IRestRoutes, IRestDataObject} from '../model';
import {ConfigurationService} from '../config';

@Injectable()
/** 
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService {
    // We don't have any timestamps until the geXY gets called,
    // therefore we need to instantiate the serverTimeStamps with -1.
    private serverTimeStamps: IUpdateData = {
        busses: -1,
        lines: -1,
        routes: -1,
        stops: -1
    };

    private logger: Logger;

    constructor(private restApi: RestApiProvider, private storageApi: PersistentDataProvider, private config: ConfigurationService) {
        this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'CitizenDataService', config.misc.log_pretty_print);
    }

    /**
     * Generic getter for T extending IRestDataObject
     * @param storageRead ()=>Observable<T> method to read T from the storage
     * @param storageWrite (T)=>void method to write into storage
     * @param serverTime : number, timestamp of the server
     * @param serverRead ()=>Observable<T> method to read from the server
     * @return Observable<T>
     */
    public getData<T extends IRestDataObject>(storageRead: () => Observable<T>,
        storageWrite: (T) => void,
        serverTime: number,
        serverRead: () => Observable<T>): Observable<T> {
        this.logger.debug('Getting data from storage');
        return storageRead().flatMap((data) => {
            this.logger.debug('Storage data fetched');
            if (data && (serverTime < data.timestamp)) {
                return Observable.of(data);
            }
            this.logger.debug('Getting data from server');
            let restObservable: Observable<T> = serverRead();
            restObservable.subscribe((data) => {
                this.logger.debug('Passing data to storage');
                storageWrite(data);
            });
            return restObservable;
        });
    }

    /**
    * @return A list of Stop object
    */
    public getStops(): Observable<Model.IStop[]> {
        this.logger.debug('Getting Stops');
        return this.getData<IRestStops>(
            () => { return this.storageApi.getStops(); },
            (data: IRestStops) => { this.storageApi.putStops(data); },
            this.serverTimeStamps.stops,
            () => { return this.restApi.getStops(); }
        ).map<Model.IStop[]>((res) => { return res.stops; });
    }

    /**
    * @return A list of ILine objects
    */
    public getLines(): Observable<Model.ILine[]> {
        return this.getData<IRestLines>(
            () => { return this.storageApi.getLines(); },
            (data: IRestLines) => { this.storageApi.putLines(data); },
            this.serverTimeStamps.lines,
            () => { return this.restApi.getLines(); }
        ).map<Model.ILine[]>((res) => { return res.lines; });
    }

    /**
    * @return A list of Bus objects
    */
    public getBusses(): Observable<Model.IBus[]> {
        return this.getData<IRestBusses>(
            () => { return this.storageApi.getBusses(); },
            (data: IRestBusses) => { this.storageApi.putBusses(data); },
            this.serverTimeStamps.busses,
            () => { return this.restApi.getBusses(); }
        ).map<Model.IBus[]>((res) => { return res.busses; });
    }

    /**
    * @return A list of Route objects
    */
    public getRoutes(): Observable<Model.IRoute[]> {
        return this.getData<IRestRoutes>(
            () => { return this.storageApi.getRoutes(); },
            (data: IRestRoutes) => { this.storageApi.putRoutes(data); },
            this.serverTimeStamps.busses,
            () => { return this.restApi.getRoutes(); }
        ).map<Model.IRoute[]>((res) => { return res.routes; });
    }

    /**
    * @param id the identifier of a bus
    * @return Object with properties (position:Point) and (delay:number)
    */
    public getBusRealTimeData(id: number): Observable<IBusRealTimeData> {
        this.logger.debug('Fetching RealTimeData for bus ' + id);
        return this.restApi.getRealTimeBusData(id);
    }

    /**
    * Refreshes the last update times from the server.
    */
    public updateTimeStamps(): Observable<IUpdateData> {
        this.logger.debug('updating timestamps');
        let observable = this.restApi.getUpdateData();
        observable.subscribe(updateData => {
            this.serverTimeStamps = updateData;
            this.logger.debug('timestamps updated');
        });
        return observable;
    }

    /**
     * Starts the automatically fetch of data
     * @param timeInterval the time interval the server is checked for new data
     */
    public startUpdateTimer(timeInterval: number): void {
        // To-be implemented.
    }

    /**
     * Specifies the server to be used
     * @param host_address : host url as string
     * @deprecated
     */
    public setHostUrl(host_address: string): void {
        this.restApi.baseUrl = host_address;
    }
}
