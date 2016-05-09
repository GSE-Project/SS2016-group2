import {UpdateData} from '../model/UpdateData';
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
    getBussesFromServer(): Promise<Bus[]>;

    /**
     * @return :Line[] containing the Line information from the server
     */
    getLinesFromServer(): Promise<Line[]>;

    /**
     * @return :Stop[] containing the Stop information from the server
     */
    getStopsFromServer(): Promise<Stop[]>;

    /**
     * @return :Route[] containing the Route information from the server
     */
    getRoutesFromServer(): Promise<Route[]>;

    /**
     * Return the position and delay of a given bus
     * @param id :number of the bus
     * @return object {position:number, delay:number}
     */
    getRealTimeBusData(id: number): Promise<{ position: Point, delay: number }>;

}