/*
* @author sholzer on 160510
*/

import {Point} from './geojson/Point';
import {CitizenDataObject} from "./CitizenDataObject";

export default BusRealTimeData;

export interface BusRealTimeData  extends  CitizenDataObject{

    delay:number;
    location:Point;
}