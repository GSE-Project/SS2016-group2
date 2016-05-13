/*
* Created by sholzer on the 3.5.2016
* Reviewed by skaldo on the 6.5.2016
*/
import {Injectable} from "angular2/core";
import {BusRealTimeData} from "../model/BusRealTimeData";
import {Bus} from "../model/Bus";
import {Line} from "../model/Line";
import {Stop} from "../model/Stop";
import {Route} from "../model/Route";
import {RestApiProvider} from "./RestApiProvider";
import {UpdateData} from "../model/UpdateData";
import {Observable} from "rxjs/Observable";
import {RestStops} from "../model/rest/RestStops";
import {RestBusses} from "../model/rest/RestBusses";
import {RestLines} from "../model/rest/RestLines";
import {RestRoutes} from "../model/rest/RestRoute";

const UPDATEDATA_BUSSES = "busses", UPDATEDATA_LINES="lines", UPDATEDATA_ROUTES="routes", UPDATEDATA_STOPS="stops";

@Injectable()
/** 
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService {

	//private _server_update_data: UpdateData;
	//private _storage_update_data: UpdateData;

	private currentUpdateData:UpdateData;
	private currentObservers : ObservableCache;


	constructor(private restApi: RestApiProvider/*, private storageApi: PersistentDataProvider*/) {
		this.currentUpdateData = { // Instantiation with timestamp:-1 seems more stable
			busses:-1,
			lines:-1,
			routes:-1,
			stops:-1
		};
		this.currentObservers  = {
			busses:Observable.of({timestamp:-1, data:<Bus[]>[]}),
			lines:Observable.of({timestamp:-1, data:<Line[]>[]}),
			routes:Observable.of({timestamp:-1, data:<Route[]>[]}),
			stops:Observable.of({timestamp:-1, data:<Stop[]>[]})
		};
		this.log("Instantiated fields. Calling first update");
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
	/*getDataArrayPromise<T>(update_data_field:string,
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
	}*/

	/**
	* @return A list of Stop object
	*/
	getStops(): Observable<RestStops> {
		return this.restApi.getStops();//currentObservers.stops;
	}


	/**
	* @return A list of Line objects
	*/
	getLines(): Observable<RestLines> {
		return this.restApi.getLines();//currentObservers.lines;
	}

	/**
	* @return A list of Bus objects
	*/
	getBusses(): Observable<RestBusses> {
		return this.restApi.getBusses();//currentObservers.busses;
	}

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number): Observable<BusRealTimeData> {
		return this.restApi.getRealTimeBusData(id);
	}


	/**
	* @return A list of Route objects
	*/
	getRoutes(): Observable<RestRoutes> {
		return this.restApi.getRoutes();//currentObservers.routes;
	}

	/**
	* Requests an update from the data source
	*/
	update(): void {
		this.log("Update() called")
		this.restApi.getUpdateData().subscribe(updateFromServer=>{
			if(updateFromServer.busses > this.currentUpdateData.busses){
				this.currentObservers.busses = this.restApi.getBusses();
				this.currentUpdateData.busses = updateFromServer.busses;
			}
			if(updateFromServer.lines > this.currentUpdateData.lines){
				this.currentObservers.lines = this.restApi.getLines();
				this.currentUpdateData.lines = updateFromServer.lines;
			}
			if(updateFromServer.routes > this.currentUpdateData.routes){
				this.currentObservers.routes = this.restApi.getRoutes();
				this.currentUpdateData.routes = updateFromServer.routes;
			}
			if(updateFromServer.stops > this.currentUpdateData.stops){
				this.log("updated Stops");
				this.currentObservers.stops = this.restApi.getStops();
				this.currentUpdateData.stops = updateFromServer.stops;
			}
		});
	}

	/**
	 * Starts the automatically fetch of data
	 * @param timeInterval the time interval the server is checked for new data
	 */
	startUpdateTimer(timeInterval: number): void {

	}
	
	log(message:string):void{
		console.log("CitizenDataService: "+message);
	}

	/**
	 * Specifies the server to be used
	 * @param host_address : host url as string
	 */
	setHostUrl(host_address: string): void {
		this.restApi.baseUrl = host_address;
	}
	/*
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
	}*/

	/*
	private logCouldNot(action: string, object: string, reason: any): void {
		console.log("CitizenDataService: Could not "+action+" "+object+" because "+JSON.stringify(reason));
	}
*/
}

/**
 * keeps the observables.
 */
export interface ObservableCache {
	busses : Observable<RestBusses>;
	lines : Observable<RestLines>;
	routes : Observable<RestRoutes>;
	stops: Observable<RestStops>;
}