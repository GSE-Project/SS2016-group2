/*
* @author sholzer on 160510
* Reviewed by skaldo on 13.05.2016
* Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
*/
import {ICitizenDataObject, Point} from './';

export default IBusRealTimeData;

export interface IBusRealTimeData extends ICitizenDataObject {
    delay?: number;
    timestamp: number;
    position: Point;
}
