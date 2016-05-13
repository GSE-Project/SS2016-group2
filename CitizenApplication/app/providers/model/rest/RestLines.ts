import {RestDataObject} from "./RestDataObject";
import {Line} from "../Line";
/**
 * Created by steff on 13.05.2016.
 */

export default RestLines;

export interface RestLines extends RestDataObject{
    data:Line[];
}