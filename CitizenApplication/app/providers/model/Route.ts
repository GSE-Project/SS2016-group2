/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */

import Point from './geojson/Point.ts';

export default Route;

export class Route {
    public id: number;
    public gpsData: Point[];
}