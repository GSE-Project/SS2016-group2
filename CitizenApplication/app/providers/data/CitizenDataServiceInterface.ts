// Currently no idea where this files can be found
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
	getStopList(filter?:Stop): Stop[];

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Line objects
	*/
	getLineList(filter?:Line): Line[];

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Bus objects
	*/
	getBusList(filter?:Bus): Bus[];

	/**
	* @param id the identifier of a bus
	* @return Object with properties (position:Point) and (delay:number)
	*/
	getBusRealTimeData(id: number):BusRealTimeData;
	
	/**
	 * Requests the current position and delay for the specified bus from the server
	 * @param id of the Bus
	 */
	requestBusRealTimeData(id:number):void;

	/**
	* @param filter optional parameter to filter the output list
	* @return A list of Route objects
	*/
	getRoutes(filter?: Route): Route[];

	/**
	* Requests an update from the data source
	*/
	update(): void;

	/**
	 * Starts the automatically fetch of data
	 * @param timeInterval the time interval the server is checked for new data
     */
	startUpdateTimer(timeInterval:number):void;


}