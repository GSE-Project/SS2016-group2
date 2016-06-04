/*
* @author sholzer on 160510
* Reviewed by skaldo on 13.05.2016
*/
import {ICitizenDataObject, Point} from './';

export default IBusRealTimeData;

export interface IBusRealTimeData extends ICitizenDataObject {
    delay: number;
    location: Point;
}
