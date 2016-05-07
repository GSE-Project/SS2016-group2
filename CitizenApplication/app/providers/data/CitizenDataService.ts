/*
 * Created by sholzer on the 3.5.2016
 * Reviewed by skaldo on the 6.5.2016
 */
import CitizenDataServiceInterface from './CitizenDataServiceInterface';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import Bus from '../model/Bus';
import Line from '../model/Line';
import Stop from '../model/Stop';
import Route from '../model/Route';
import Point from '../model/geojson/Point';
import {RestApiProvider} from "./RestApiProvider";
import {PersistentDataProvider} from "./PersistentDataProvider";
import {UpdateData} from "../model/UpdateData";
import {timeInterval} from "rxjs/operator/timeInterval";

@Injectable()
/**
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService implements CitizenDataServiceInterface {
	private timerId: number = null;
	private restApi: RestApiProvider;/*TODO initialize*/
	private storageApi: PersistentDataProvider;/*TODO initialize*/
	private cache: CitizenDataCache = new CitizenDataCache;
	
	constructor(restApi: RestApiProvider, storageApi: PersistentDataProvider) {
		if (!restApi) {
			this.restApi = new RestApiProvider();
		} else {
			this.restApi = restApi;
		}
		if (!storageApi) {
			this.storageApi = new PersistentDataProvider();
		} else {
			this.storageApi = storageApi;
		}
		this.populateDataCache();
	}

	/*
	 * Generic function for filtering of the objects implementing the DataItemInterface
	 * Added by skaldo on 06.05.2016
	 * @param filter optional parameter to filter the output list
	 * @return A list of Stop object
	 */
	private getDataItem<T>(cache: Array<T>, filter?: T): T[]{
		if (!filter) {
			return cache;
		}
		var result: T = cache.find((value)=>{
			return value['id'] == filter['id'];
		});
		
		return [result];
	}

	/*
	* Interface methods
	*/

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Stop object
	*/
	getStopList(filter?: Stop): Stop[] {
		return this.getDataItem<Stop>(this.cache.cached_stops, filter); 
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(filter?: Line): Line[] {
		return this.getDataItem<Line>(this.cache.cached_lines, filter); 
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(filter?: Bus): Bus[] {
		return this.getDataItem<Bus>(this.cache.cached_busses, filter); 
	};

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number): { position: Point, delay: number } {
		return this.restApi.getRealTimeBusData(id);
	};

	/**
	* @param filter optional parameter to filter the output list.
	* @return A list of Route objects
	*/
	getRoutes(filter?: Route): Route[] {
		// skaldo 06.05.2016:
    	// I don't think, that this is going to be so easy, we might need thhe promise API here,
		// as the request is going to be async.
		return this.getDataItem<Route>(this.cache.cached_routes, filter); 
	};

	/**
	* Requests an update from the data source
	*/
	update(): void {
		var serverTime: UpdateData = this.restApi.getUpdateDataFromServer();
		var currentCacheTime: UpdateData = this.cache.cached_timestamp;
		if (serverTime.busses > currentCacheTime.busses) {
			this.cache.cached_busses = this.restApi.getBussesFromServer();
		}
		if (serverTime.lines > currentCacheTime.lines) {
			this.cache.cached_lines = this.restApi.getLinesFromServer();
		}
		if (serverTime.routes > currentCacheTime.routes) {
			this.cache.cached_routes = this.restApi.getRoutesFromServer();
		}
		if (serverTime.stops > currentCacheTime.stops) {
			this.cache.cached_stops = this.restApi.getStopsFromServer();
		}
		this.cache.cached_timestamp = serverTime;
		this.putDataToStorage(this.cache);
	};

	public startUpdateTimer(timeInterval: number): void {
		// skaldo, 06.05.2016:
		// Better than using the timer, use the interval function after we receive the response,
		// as we might face some problems in the future here.
		if (!this.timerId) {
			this.timerId = window.setInterval(this.update, timeInterval);
		}
	}
	
	/**
	 * Stops the update timer.
	 */
	public stopUpdateTimer(){
		window.clearInterval(this.timerId);
	}

	/**
	 * Fetches the data from the storage
	 * @returns CitizenDataCache with the data from the storage
     */
	private populateDataCache(): CitizenDataCache {
		var cache: CitizenDataCache = new CitizenDataCache;
		cache.cached_timestamp = this.storageApi.getLastUpdateTimes();
		cache.cached_busses = this.storageApi.getBusses();
		cache.cached_lines = this.storageApi.getLines();
		cache.cached_routes = this.storageApi.getRoutes();
		cache.cached_stops = this.storageApi.getStops();
		return cache;
	};

	private putDataToStorage(data: CitizenDataCache): void {
		this.storageApi.putBusses(data.cached_busses);
		this.storageApi.putLines(data.cached_lines);
		this.storageApi.putRoutes(data.cached_routes);
		this.storageApi.putStops(data.cached_stops);
		this.storageApi.putLastUpdateTimes(data.cached_timestamp);
	}
}

/**
 * Structure to hold the cached data
 */
class CitizenDataCache {
	cached_busses: Bus[] = [];
	cached_lines: Line[] = [];
	cached_stops: Stop[] = [];
	cached_routes: Route[] = [];
	cached_timestamp: UpdateData = new UpdateData;
}