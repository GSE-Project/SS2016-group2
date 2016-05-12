/*
* Created by sholzer on the 3.5.2016
* Reviewed by skaldo on the 6.5.2016
*/
import CitizenDataServiceInterface from './CitizenDataServiceInterface';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {BusRealTimeData}  from '../model/BusRealTimeData';
import {Bus} from '../model/Bus';
import {Line} from '../model/Line';
import {Stop} from '../model/Stop';
import {Route} from '../model/Route';
import {Point} from '../model/geojson/Point';
import {RestApiProvider} from "./RestApiProvider";
import {PersistentDataProvider} from "./PersistentDataProvider";
import {UpdateData} from "../model/UpdateData";
import {timeInterval} from "rxjs/operator/timeInterval";

const UPDATEDATA_BUSSES = "busses", UPDATEDATA_LINES="lines", UPDATEDATA_ROUTES="routes", UPDATEDATA_STOPS="stops";

@Injectable()
/** 
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService implements CitizenDataServiceInterface {

	private _server_update_data: UpdateData;
	private _storage_update_data: UpdateData;

	constructor(private restApi: RestApiProvider, private storageApi: PersistentDataProvider) {
		this.server_update_data = null;
		this.storage_update_data = null;
		this.update();
	}
	

	/**
	 * I've created a monster :S
	 * Returns a promised array with objects of type T from either the server or the local storage depending on the currently known update timestamp
	 * @param update_data_field the name of the timestamps i.e. busses, lines, ...
	 * @param rest_get_api method to get the data array from the server
	 * @param storage_get_api method to get the data array from the local storage
	 * @param storage_put_api method to set a data array in the storage
	 * @return Promise<T[]>
	 * @author sholzer
	 */
	getDataArrayPromise<T>(update_data_field:string,
		rest_get_api: () => Promise<{ timestamp: number, data: T[] }>,
		storage_get_api: () => Promise<T[]>,
		storage_put_api: (promised_array:Promise<T[]>) => void): Promise<T[]> {

		if (this._server_update_data[update_data_field] > this._storage_update_data[update_data_field]) {
			var server_promise = rest_get_api();
			// Create resolvable Promise for the data array (throwing away the timestamp field)
			var result_promise = new Promise<T[]>((resolve, reject)=>{
				server_promise.then(value=>{
					if(!value){reject("Null fetched");}
					resolve(value.data);
				}).catch(reason=>{reject(reason);});
			});
			
			//Write the new time stamp to the storage. Potentially unstable (what if the result_promise is rejected?)
			this._storage_update_data[update_data_field] = this._server_update_data[update_data_field];
			this.putUpdateData(this._storage_update_data);
			//Return promised to storage and caller
			storage_put_api(result_promise);
			return result_promise;
		} else {
			return storage_get_api();
		}
	}

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Stop object
	*/
	getStopList(): Promise<Stop[]> {
		return this.getDataArrayPromise<Stop>(
			UPDATEDATA_STOPS, 
			this.restApi.getStopsFromServer,
			this.storageApi.getStops,
			this.storageApi.putStops
		);


	}


	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(): Promise<Line[]> {
		return this.getDataArrayPromise<Line>(
			UPDATEDATA_LINES,
			this.restApi.getLinesFromServer,
			this.storageApi.getLines,
			this.storageApi.putLines
		);
	}

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(): Promise<Bus[]> {
		return this.getDataArrayPromise<Bus>(
			UPDATEDATA_BUSSES,
			this.restApi.getBussesFromServer,
			this.storageApi.getBusses,
			this.storageApi.putBusses
		);
	}

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number): Promise<BusRealTimeData> {
		return this.restApi.getRealTimeBusData(id);
	}


	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Route objects
	*/
	getRoutes(): Promise<Route[]> {
		return this.getDataArrayPromise<Route>(
			UPDATEDATA_ROUTES,
			this.restApi.getRoutesFromServer,
			this.storageApi.getRoutes,
			this.storageApi.putRoutes	
		);
	}

	/**
	* Requests an update from the data source
	*/
	update(): void {
		this.storageApi.getLastUpdateTimes()
			.then((value) => {
				this.storage_update_data = value;
			}).catch(reason => {
				this.logCouldNot("fetch", "stored update data", reason);
			});
		this.restApi.getUpdateDataFromServer()
			.then(value => {
				this._server_update_data = value;
			})
			.catch(reason => { this.logCouldNot("fetch", "remote update data", reason); });
	}

	/**
	 * Starts the automatically fetch of data
	 * @param timeInterval the time interval the server is checked for new data
	 */
	startUpdateTimer(timeInterval: number): void {

	}

	/**
	 * Specifies the server to be used
	 * @param host_address : host url as string
	 */
	setRestApi(host_address: string): void {

	}

	putUpdateData(data: UpdateData): void {
		this.storageApi.putLastUpdateTimes(Promise.resolve(data));
	}


	public set server_update_data(v: UpdateData) {
		if (!v) {
			v = new UpdateData();
			v.busses = -1;
			v.lines = -1;
			v.routes = -1;
			v.stops = -1;
		}
		this._server_update_data = v;
	}


	public set storage_update_data(v: UpdateData) {
		if (!v) {
			v = new UpdateData();
			v.busses = -1;
			v.lines = -1;
			v.routes = -1;
			v.stops = -1;
		}
		this._storage_update_data = v;
	}

	private logCouldNot(action: string, object: string, reason: any): void {
		
	}

}
