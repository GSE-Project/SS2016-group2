import CitizenDataServiceInterface from './CitizenDataServiceInterface.ts';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import Bus from '../model/Bus.ts';
import Line from '../model/Line.ts';
import Stop from '../model/Stop.ts';
import Route from '../model/Route.ts';
import Point from '../model/geojson/Point.ts';
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import PersistentDataProviderInterface from "./PersistentDataProviderInterface";
import {UpdateData} from "../model/UpdateData";

@Injectable()
/**
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService implements CitizenDataServiceInterface{

	constructor(){
		this.cache = this.populateDataCache();
		this.update();
	}

	private restApi: RestApiProviderInterface /*TODO initialize*/ ;
	private storageApi : PersistentDataProviderInterface /*TODO initialize*/;
	private cache:CitizenDataCache = new CitizenDataCache;


	/*
	* Interface methods
	*/

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Stop object
	*/
	getStopList(filter?: Stop): Stop[]{
		if(filter == null){
			return this.cache.cached_stops.slice();
		}
		var result : Stop[] = this.cache.cached_stops.slice();
		for(var i : number  = 0; i < result.length;i++){
			if(filter.id != result[i].id){
				result.splice(i,1);
			}
		}
		return result;
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(filter?: Line): Line[] {
		if(filter == null){
			return this.cache.cached_lines.slice();
		}
		var result : Line[] = this.cache.cached_lines.slice();
		for(var i : number  = 0; i < result.length;i++){
			if(filter.id != result[i].id){
				result.splice(i,1);
			}
		}
		return result;
	};

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(filter?: Bus): Bus[] {
		if(filter == null){
			return this.cache.cached_busses.slice();
		}
		var result : Bus[] = this.cache.cached_busses.slice();
		for(var i : number  = 0; i < result.length;i++){
			if(filter.id != result[i].id){
				result.splice(i,1);
			}
		}
		return result;
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
		if(filter == null){
			return this.cache.cached_routes.slice();
		}
		var result : Route[] = this.cache.cached_routes.slice();
		for(var i : number  = 0; i < result.length;i++){
			if(filter.id != result[i].id){
				result.splice(i,1);
			}
		}
		return result;
	};

	/**
	* Requests an update from the data source
	*/
	update(): void {
		var serverTime : UpdateData = this.restApi.getUpdateDataFromServer();
		var currentCacheTime : UpdateData = this.cache.cached_timestamp;
		if(serverTime.busses > currentCacheTime.busses){
			this.cache.cached_busses = this.restApi.getBussesFromServer();
		}
		if(serverTime.lines > currentCacheTime.lines){
			this.cache.cached_lines = this.restApi.getLinesFromServer();
		}
		if(serverTime.routes > currentCacheTime.routes){
			this.cache.cached_routes = this.restApi.getRoutesFromServer();
		}
		if(serverTime.stops > currentCacheTime.stops){
			this.cache.cached_stops = this.restApi.getStopsFromServer();
		}
		this.cache.cached_timestamp = serverTime;
		this.putDataToStorage(this.cache);
	};

	/**
	 * Fetches the data from the storage
	 * @returns CitizenDataCache with the data from the storage
     */
	private populateDataCache():CitizenDataCache{
		var cache : UpdateData = new CitizenDataCache;
		cache.cached_timestamp = this.storageApi.getLastUpdateTimes();
		cache.cached_busses = this.storageApi.getBusses();
		cache.cached_lines = this.storageApi.getLines();
		cache.cached_routes = this.storageApi.getRoutes();
		cache.cached_stops = this.storageApi.getStops();
		return cache;
	};

	private putDataToStorage(data:CitizenDataCache):void{
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
class CitizenDataCache{
	cached_busses : Bus[] = [];
	cached_lines : Line[]=[];
	cached_stops: Stop[]=[];
	cached_routes: Route[]=[];
	cached_timestamp : UpdateData = new UpdateData;
}