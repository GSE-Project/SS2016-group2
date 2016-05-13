/**
 * Created by sholzer on the 3.5.2016
 * Reviewed by skaldo on the 6.5.2016
 * Updated by skaldo & sholzer on the 13.05.2016
 */

import {Injectable} from "angular2/core";
import {RestApiProvider} from "./RestApiProvider";
import {PersistentDataProvider} from "./PersistentDataProvider";
import {Observable} from "rxjs/Observable";
import {IBusRealTimeData, IUpdateData, IRestStops, IRestBusses, IRestLines, IRestRoutes} from "../model";

const UPDATEDATA_BUSSES = "busses",
	UPDATEDATA_LINES = "lines",
	UPDATEDATA_ROUTES = "routes",
	UPDATEDATA_STOPS = "stops";

@Injectable()
/** 
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService {
	private serverTimeStamps: IUpdateData;

	constructor(private restApi: RestApiProvider, private storageApi: PersistentDataProvider) {
		this.serverTimeStamps = { // Instantiation with timestamp:-1 seems more stable
			busses: -1,
			lines: -1,
			routes: -1,
			stops: -1
		};
		this.log("Instantiated fields. Getting the update times from the server.");
		this.updateTimeStamps();
	}

	/**
	* @return A list of Stop object
	*/
	getStops(): Observable<IRestStops> {
        var currentTime = new Date().getTime();
		// Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
			let observable = this.restApi.getStops();
			observable.subscribe(data => {
				// Save the data from the server.
				this.storageApi.putStops(data);
			});
			return observable;
		}
		return this.storageApi.getStops();
	}

	/**
	* @return A list of ILine objects
	*/
	getLines(): Observable<IRestLines> {
        var currentTime = new Date().getTime();
		// Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
			let observable = this.restApi.getLines();
			observable.subscribe(data => {
				// Save the data from the server.
				this.storageApi.putLines(data);
			});
			return observable;
		}
		return this.storageApi.getLines();
	}

	/**
	* @return A list of Bus objects
	*/
	getBusses(): Observable<IRestBusses> {
        var currentTime = new Date().getTime();
		// Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
			let observable = this.restApi.getBusses();
			observable.subscribe(data => {
				// Save the data from the server.
				this.storageApi.putBusses(data);
			});
			return observable;
		}
		return this.storageApi.getBusses();
	}

	/**
	* @return A list of Route objects
	*/
	getRoutes(): Observable<IRestRoutes> {
        var currentTime = new Date().getTime();
		// Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
			let observable = this.restApi.getRoutes();
			observable.subscribe(data => {
				// Save the data from the server.
				this.storageApi.putRoutes(data);
			});
			return observable;
		}
		return this.storageApi.getRoutes();
	}

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getIBusRealTimeData(id: number): Observable<IBusRealTimeData> {
		return this.restApi.getRealTimeBusData(id);
	}

	/**
	* Refreshes the last update times from the server.
	*/
	updateTimeStamps(): void {
		this.restApi.getUpdateData().subscribe(updateData => {
			this.serverTimeStamps = updateData;
		});
	}

	/**
	 * Starts the automatically fetch of data
	 * @param timeInterval the time interval the server is checked for new data
	 */
	startUpdateTimer(timeInterval: number): void {

	}

	log(message: string): void {
		console.log("CitizenDataService: " + message);
	}

	/**
	 * Specifies the server to be used
	 * @param host_address : host url as string
	 */
	setHostUrl(host_address: string): void {
		this.restApi.baseUrl = host_address;
	}
}
