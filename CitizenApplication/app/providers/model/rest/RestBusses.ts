import {RestDataObject} from "./RestDataObject";
import {Bus} from "../Bus";
/**
 * Created by steff on 13.05.2016.
 */

export default RestBusses;

export interface RestBusses extends RestDataObject {
    data:Bus[];
}