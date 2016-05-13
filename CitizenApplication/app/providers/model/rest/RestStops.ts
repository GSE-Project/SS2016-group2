import {RestDataObject} from "./RestDataObject";
import {Stop} from "../Stop";
/**
 * Created by steff on 13.05.2016.
 */


export interface RestStops extends RestDataObject{

    data:Stop[];

}