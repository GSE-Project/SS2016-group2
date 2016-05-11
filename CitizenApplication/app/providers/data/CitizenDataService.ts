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

@Injectable()
/**
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService implements CitizenDataServiceInterface {
	private timerId: number = null;
	private restApi: RestApiProvider;
	private storageApi: PersistentDataProvider;
	private cache: CitizenDataCache = new CitizenDataCache;

	constructor(http:Http, restApi?: RestApiProvider, storageApi?: PersistentDataProvider) {
		if (!restApi) {
			this.restApi = new RestApiProvider(http);
		} else {
			this.restApi = restApi;
		}
		if (!storageApi) {
			this.storageApi = new PersistentDataProvider();
		} else {
			this.storageApi = storageApi;
		}
		this.cache = new CitizenDataCache();
		this.requestStorageData();
	}

	/*
	 * Generic function for filtering of the objects implementing the DataItemInterface
	 * Added by skaldo on 06.05.2016
	 * @param filter optional parameter to filter the output list
	 * @return A list of Stop object
	 */
	private getDataItem<T>(cache: Array<T>, filter?: T): T[] {
		if (!filter) {
			return cache;
		}
		var result: T = cache.find((value) => {
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
	getBusRealTimeData(id: number): BusRealTimeData {
		var existingEntry: BusRealTimeData = this.getEntryForId(id, this.cache.cached_busses_real_time_data);
		if(existingEntry == null){
			existingEntry = new BusRealTimeData();
		}
		return existingEntry;
	};

	requestBusRealTimeData(id: number): void {
		this.restApi.getRealTimeBusData(id).then((value) => {
			var existingEntry: BusRealTimeData = this.getEntryForId(id, this.cache.cached_busses_real_time_data);
			if (existingEntry != null) {
				this.cache.cached_busses_real_time_data.splice(
					this.cache.cached_busses_real_time_data.indexOf(existingEntry)
				);
			}
			this.cache.cached_busses_real_time_data.push(value);
		});
	}

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
	* Requests an update from the data source. 
	*/
	update(): void {
		// First request only the timestamps
		this.restApi.getUpdateDataFromServer().then((value) => {
			// when the timestamps are fetched decide for each data set if an update is neccessary 
			if (value.busses > this.cache.cached_timestamp.busses) {
				this.restApi.getBussesFromServer().then((value) => {
					this.cache.cached_busses = value.data;
					this.cache.cached_busses_from_server = true;
					this.cache.cached_timestamp.busses = value.timestamp;
					this.storageApi.putBusses(value.data);
				});
			};
			if (value.lines > this.cache.cached_timestamp.lines) {
				this.restApi.getLinesFromServer().then((value) => {
					this.cache.cached_lines = value.data;
					this.cache.cached_lines_from_server = true;
					this.cache.cached_timestamp.lines = value.timestamp;
					this.storageApi.putLines(value.data);
				});
			};
			if (value.routes > this.cache.cached_timestamp.routes) {
				this.restApi.getRoutesFromServer().then((value) => {
					this.cache.cached_routes = value.data;
					this.cache.cached_routes_from_server = true;
					this.cache.cached_timestamp.routes = value.timestamp;
					this.storageApi.putRoutes(value.data);
				});
			};
			if (value.stops > this.cache.cached_timestamp.stops) {
				this.restApi.getStopsFromServer().then((value) => {
					this.cache.cached_stops = value.data;
					this.cache.cached_stops_from_server = true;
					this.cache.cached_timestamp.stops = value.timestamp;
					this.storageApi.putStops(value.data);
				});
			};
			this.storageApi.putLastUpdateTimes(value);

		});
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
	public stopUpdateTimer() {
		window.clearInterval(this.timerId);
	}

	/**
	 * Requests the locally stored data. The requested data will NOT replace data fetched from the server
	 * @author sholzer
	 */
	private requestStorageData(): void {
		this.storageApi.getLastUpdateTimes().then((value) => {
			if (this.cache.cached_timestamp_from_server) return;
			this.cache.cached_timestamp = value;
		});
		this.storageApi.getBusses().then((value) => {
			// if the cache contains data from the server we don't need the data from the storage
			if (this.cache.cached_busses_from_server) return;
			this.cache.cached_busses = value;
		});
		this.storageApi.getLines().then((value) => {
			if (this.cache.cached_lines_from_server) return;
			this.cache.cached_lines = value;
		});
		this.storageApi.getStops().then((value) => {
			if (this.cache.cached_stops_from_server) return;
			this.cache.cached_stops = value;
		});
		this.storageApi.getRoutes().then((value) => {
			if (this.cache.cached_routes_from_server) return;
			this.cache.cached_routes = value;
		});
	}


	/**
	 * Stores the current cache in the data storage
	 * sholzer: seems never to be called
	 */
	private putDataToStorage(data: CitizenDataCache): void {
		this.storageApi.putBusses(data.cached_busses);
		this.storageApi.putLines(data.cached_lines);
		this.storageApi.putRoutes(data.cached_routes);
		this.storageApi.putStops(data.cached_stops);
		this.storageApi.putLastUpdateTimes(data.cached_timestamp);
	}

	private getEntryForId<T>(id: number, list: T[]): T {
		var result: T = null;
		list.forEach((t) => {
			if (t['id'] == id) {
				result = t;
				return;
			}
		});
		return result;
	}
}

/**
 * Structure to hold the cached data
 */
class CitizenDataCache {
	cached_busses: Bus[] = [];
	cached_busses_from_server: boolean = false;
	cached_busses_real_time_data: BusRealTimeData[] = [];
	cached_lines: Line[] = [];
	cached_lines_from_server: boolean = false;
	cached_stops: Stop[] = [];
	cached_stops_from_server: boolean = false;
	cached_routes: Route[] = [];
	cached_routes_from_server: boolean = false;
	cached_timestamp: UpdateData = new UpdateData();
	cached_timestamp_from_server: boolean = false;

}
