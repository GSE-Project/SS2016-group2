/*
* @author sholzer on 160510
* Reviewed by skaldo on 13.05.2016
*/

import {Point} from './geojson/Point';
import {ICitizenDataObject} from './CitizenDataObject';

export default IBusRealTimeData;

export interface IBusRealTimeData extends ICitizenDataObject {
    delay: number;
    location: Point;
}
