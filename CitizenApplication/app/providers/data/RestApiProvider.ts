/**
 * Log:
 * Created by skaldo on 07.05.2016.
 * Reviewed and updated by skaldo on 22.05.2016
 * Updated by sholzer on the 28.05.2016 - added generic method
 * Reviewed by skaldo on the 28.05.2016 - OK
 * Reviewed by skaldo on the 06.06.2016 - Changed a param to optional.
 */

import {Injectable} from '@angular/core';
import {Device} from 'ionic-native';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CitizenDataObjects, IUpdateData, IBus, ILine, IRoute, IStop, IBusRealTimeData, IRestStops, IRestBusses, IRestLines, IRestRoutes, IRestDataObject, IRequest, IRequestState, IRequestResponse} from '../model';
import 'rxjs/Rx';
import {ConfigurationService} from '../config';
import {Logger, LoggerFactory} from '../logger';

/**
 * Default Post options, marking the body of a post as json parsable
 */
const POST_OPTIONS = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });


/**
 * Provides access to the rest backend. 
 */
@Injectable()
export class RestApiProvider {

    private logger: Logger;
    private UUID: string;

    constructor(private http: Http, private config: ConfigurationService) {
        this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'RestApiProvider', config.misc.log_pretty_print);
        this.logger.info('using server at ' + config.restApi.host_url);
        this.UUID = this.getUUID();
    }

    /**
     * Does nothing
     * @deprecated
     */
    set baseUrl(value: string) {

    }

    /**
     * Return a data object from the rest server
     * @param data: CitizenDataObjects specifying the object to be returned. 
     * @return Observable<T>
     */
    getData<T>(data: CitizenDataObjects, urlSuffix?: string): Observable<T> {
        urlSuffix = urlSuffix ? urlSuffix : '';
        this.logger.debug('Accessing ' + this.config.getUrl(data) + urlSuffix);
        return this.http.get(this.config.getUrl(data) + urlSuffix).map(
            res => {
                return <T>res.json();
            }
        );
    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<RestStops>}
     */
    getStops(): Observable<IRestStops> {
        return this.getData<IRestStops>(CitizenDataObjects.Stop);
    }

    /**
     * @author skaldo & sholzer
     * @returns {Observable<IUpdateData>} resolving into the current IUpdateData of the server
     */
    getUpdateData(): Observable<IUpdateData> {
        return this.getData<IUpdateData>(CitizenDataObjects.UpdateData);
    };

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestBusses>} resolving into the current IRestBusses from the server
    */
    getBusses(): Observable<IRestBusses> {
        return this.getData<IRestBusses>(CitizenDataObjects.Bus);
    }

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestLines>} resolving into the current IRestLines from the server
    */
    getLines(): Observable<IRestLines> {
        return this.getData<IRestLines>(CitizenDataObjects.Line);
    };

    /**
    * @author skaldo & sholzer
    * @returns {Observable<IRestRoutes>} resolving into the current IRestRoutes from the server
    */
    getRoutes(): Observable<IRestRoutes> {
        return this.getData<IRestRoutes>(CitizenDataObjects.Route);
    };

    /**
    * @author skaldo & sholzer
    * @param id : number specifying the bus
    * @returns {Observable<IBusRealTimeData>} resolving into the current IBusRealTimeData of the specified bus from the server
    */
    getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
        return this.getData<IBusRealTimeData>(CitizenDataObjects.RealTimeData, String(id));
    };

    /**
     * @author sholzer
     * @param id: the request id
     * @return Observable<IRequestState> resolving to the current IRequestState
     */
    getRequestStates(): Observable<IRequestState[]> {
        let url: string = this.config.getUrl(CitizenDataObjects.GetRequest) + '?deviceId=' + this.UUID;
        this.logger.debug('Accessing ' + url);
        return this.http.get(this.config.getUrl(CitizenDataObjects.GetRequest) + '?deviceId=' + this.UUID).map<IRequestState[]>(res => {
            return res.json();
        });
    }

    postRequest(req: IRequest): Observable<IRequestResponse> {
        req.deviceID = this.getUUID();
        this.logger.debug('Request ' + JSON.stringify(req) + ' @ ' + this.config.getUrl(CitizenDataObjects.PostRequest));
        return this.http.post(this.config.getUrl(CitizenDataObjects.PostRequest), JSON.stringify(req), POST_OPTIONS).map<IRequestResponse>(
            res => {
                this.logger.debug('Server responds with: ' + JSON.stringify(res.json()));
                return <IRequestResponse>res.json();
            }, this);
    }

    changeRequestState(regId: number, state: number) {
        let url = this.config.getUrl(CitizenDataObjects.PostRequest) + '/' + regId;
        this.logger.debug('Calling ' + url + ' to change state of request ' + regId + ' to ' + state);
        let observable = this.http.post(url, JSON.stringify({ status: state }), POST_OPTIONS);
        observable.subscribe(res => {
            this.logger.debug('Send Request Change');
        });
        return observable;
    }

    /**
     * @author sholzer
     * @return iff executed on a device the uuid is returned. Otherwise just 'somePC'
     */
    private getUUID(): string {
        let result = 'somePC';
        if (Device && Device.device && Device.device.uuid) {
            result = Device.device.uuid;
            this.logger.debug('This device has the ID ' + result);
        }
        return result;
    }
}
