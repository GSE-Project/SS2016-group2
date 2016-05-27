/**
 * Created by sholzer on the 3.5.2016
 * Reviewed by skaldo on the 6.5.2016
 * Updated by skaldo & sholzer on the 13.05.2016
 * Updated by skaldo on the 14.05.2016 - adjusted to match the tslint rules.
 */

import {Injectable} from '@angular/core';
import {RestApiProvider} from './RestApiProvider';
import {PersistentDataProvider} from './PersistentDataProvider';
import {Observable} from 'rxjs/Observable';
import {Logger, LoggerFactory} from '../logger/Logger';
import {IBusRealTimeData, IUpdateData, IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../model';
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
    * @return A list of Stop object
    */
    public getStops(): Observable<IRestStops> {
        this.logger.debug('Getting Stops');
        return this.storageApi.getStops().flatMap(data => {
            if (data && (this.serverTimeStamps.stops < data.timestamp)) {
                return Observable.of(data);
            }
            let restObservable: Observable<IRestStops> = this.restApi.getStops();
            restObservable.subscribe(server_data => {
                this.storageApi.putStops(server_data);
            });
            return restObservable;
        });
    }

    /**
    * @return A list of ILine objects
    */
    public getLines(): Observable<IRestLines> {
        return this.storageApi.getLines().flatMap(data => {
            if (data && (this.serverTimeStamps.lines < data.timestamp)) {
                return Observable.of(data);
            }
            let restObservable: Observable<IRestLines> = this.restApi.getLines();
            restObservable.subscribe(server_data => {
                this.storageApi.putLines(server_data);
            });
            return restObservable;
        });
    }

    /**
    * @return A list of Bus objects
    */
    public getBusses(): Observable<IRestBusses> {
        return this.storageApi.getBusses().flatMap(data => {
            if (data && (this.serverTimeStamps.busses < data.timestamp)) {
                return Observable.of(data);
            }
            let restObservable: Observable<IRestBusses> = this.restApi.getBusses();
            restObservable.subscribe(server_data => {
                this.storageApi.putBusses(server_data);
            });
            return restObservable;
        });
    }

    /**
    * @return A list of Route objects
    */
    public getRoutes(): Observable<IRestRoutes> {
        return this.storageApi.getRoutes().flatMap(data => {
            if (data && (this.serverTimeStamps.routes < data.timestamp)) {
                return Observable.of(data);
            }
            let restObservable: Observable<IRestRoutes> = this.restApi.getRoutes();
            restObservable.subscribe(server_data => {
                this.storageApi.putRoutes(server_data);
            });
            return restObservable;
        });
    }

    /**
    * @param id the identifier of a bus
    * @return Object with properties (position:Point) and (delay:number)
    */
    public getBusRealTimeData(id: number): Observable<IBusRealTimeData> {
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
     */
    public setHostUrl(host_address: string): void {
        this.restApi.baseUrl = host_address;
    }
}
