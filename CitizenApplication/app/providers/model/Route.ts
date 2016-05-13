/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */

import Point from './geojson/Point.ts';
import {CitizenDataObject} from "./CitizenDataObject";

export default Route;

export interface Route extends CitizenDataObject {
    gpsData: Point[];
}