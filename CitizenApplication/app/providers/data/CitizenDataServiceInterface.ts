/**
 * @author sholzer 160512
 */
import Bus from '../model/Bus.ts';
import Line from '../model/Line.ts';
import Stop from '../model/Stop.ts';
import Route from '../model/Route.ts';
import {BusRealTimeData}  from '../model/BusRealTimeData';
import Point from '../model/geojson/Point.ts';

export default CitizenDataServiceInterface;

/**
* Interface of the data logic for the Citizen App
*/
interface CitizenDataServiceInterface {

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Stop object
	*/
	getStopList(): Promise<Stop[]>;

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(): Promise<Line[]>;

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(): Promise<Bus[]>;

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number):Promise<BusRealTimeData>;
	

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Route objects
	*/
	getRoutes(): Promise<Route[]>;

	/**
	* Requests an update from the data source
	*/
	update(): void;

	/**
	 * Starts the automatically fetch of data
	 * @param timeInterval the time interval the server is checked for new data
     */
	startUpdateTimer(timeInterval:number):void;
	
	/**
	 * Specifies the server to be used
	 * @param host_address : host url as string
	 */
	setRestApi(host_address:string):void;


}