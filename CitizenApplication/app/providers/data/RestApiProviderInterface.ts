import {UpdateData} from '../model/UpdateData';
import {BusRealTimeData}  from '../model/BusRealTimeData';
import Bus from '../model/Bus';
import Line from '../model/Line';
import Stop from '../model/Stop';
import Route from '../model/Route';
import Point from '../model/geojson/Point';

/**
 * Created by sholzer on 03.05.2016.
 */


export interface RestApiProviderInterface {

    /**
     * @return :UpdateData containing the time stamps of the data on the server
     */
    getUpdateDataFromServer(): Promise<UpdateData>;

    /**
     * @return :Bus[] containing the Bus information from the server
     */
    getBussesFromServer(): Promise<{timestamp: number, data: Bus[]}>;

    /**
     * @return :Line[] containing the Line information from the server
     */
    getLinesFromServer(): Promise<{timestamp: number, data: Line[]}>;

    /**
     * @return :Stop[] containing the Stop information from the server
     */
    getStopsFromServer(): Promise<{timestamp: number, data: Stop[]}>;

    /**
     * @return :Route[] containing the Route information from the server
     */
    getRoutesFromServer(): Promise<{timestamp: number, data: Route[]}>;

    /**
     * Return the position and delay of a given bus
     * @param id :number of the bus
     * @return object {position:number, delay:number}
     */
    getRealTimeBusData(id: number): Promise<BusRealTimeData>;

}