/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */

import Point from './geojson/Point.ts';
import {ICitizenDataObject} from './CitizenDataObject';

export default IRoute;

export interface IRoute extends ICitizenDataObject {
    gpsData: Point[];
}
