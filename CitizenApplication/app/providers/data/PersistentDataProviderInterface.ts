import Bus from "../model/Bus";
import {UpdateData} from "../model/UpdateData";
import Line from "../model/Line";
import Stop from "../model/Stop";
import Route from "../model/Route";
/**
 * Created by sholzer on 03.05.2016.
 */

export default PersistentDataProviderInterface;

/**
 * Retrieves data from and stores data in the data store
 */
export interface PersistentDataProviderInterface{

    /**
     * Returns the time stamps of the data store lists
     * @return UpdateData object from the data storage
     */
    getLastUpdateTimes():Promise<UpdateData>;

    /**
     * Sets the time stamp of the data storage
     * @param updateTimes : UpdateData
     */
    putLastUpdateTimes(updateTimes:UpdateData):void;

    /**
     * @return Array of Bus objects from the data store
     */
    getBusses():Promise<Array<Bus>>;

    /**
     * Stores a list of Bus object in the data storage. This method overwrites an already existing Bus object list in the storage
     * @param busses :Bus[]
     */
    putBusses(busses:Bus[]):void;

    /**
     * @return Array of Line objects from the data store
     */
    getLines():Promise<Array<Line>>;

    /**
     * Stores a list of Line object in the data storage. This method overwrites an already existing Line object list in the storage
     * @param lines :Line[]
     */
    putLines(lines:Line[]):void;

    /**
     * @return Array of Stop objects from the data store
     */
    getStops():Promise<Array<Stop>>;

    /**
     * Stores a list of Stop object in the data storage. This method overwrites an already existing Stop object list in the storage
     * @param stops :Stop[]
     */
    putStops(stops:Stop[]):void;

    /**
     * @return Array of Route objects from the data store
     */
    getRoutes():Promise<Array<Route>>;

    /**
     * Stores a list of Route object in the data storage. This method overwrites an already existing Route object list in the storage
     * @param routes :Route[]
     */
    putRoutes(routes:Route[]):void;
}