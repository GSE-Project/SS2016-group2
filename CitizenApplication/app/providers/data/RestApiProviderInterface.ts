import {UpdateData} from "../model/UpdateData";
import Bus from "../model/Bus";
import Line from "../model/Line";
import Stop from "../model/Stop";
import Route from "../model/Route";
/**
 * Created by sholzer on 03.05.2016.
 */


export interface RestApiProviderInterface{

    /**
     * @return :UpdateData containing the time stamps of the data on the server
     */
    getUpdateDataFromServer():UpdateData;

    /**
     * @return :Bus[] containing the Bus information from the server
     */
    getBussesFromServer():Bus[];

    /**
     * @return :Line[] containing the Line information from the server
     */
    getLinesFromServer():Line[];

    /**
     * @return :Stop[] containing the Stop information from the server
     */
    getStopsFromServer():Stop[];

    /**
     * @return :Route[] containing the Route information from the server
     */
    getRoutesFromServer():Route[];

    /**
     * Return the position and delay of a given bus
     * @param id :number of the bus
     * @return object {position:number, delay:number}
     */
    getRealTimeBusData(id:number):{ position: Point, delay: number };

}