/**
 * Created by sholzer on 03.05.2016 after GeoJSon specification.
 * Updated & reviewed by skaldo on 05.05.2016.
 */

import GeoJSonObject from './GeoJSonObject.ts';
import Coordinate from './Coordinate.ts';

export default Point;

export class Point implements GeoJSonObject {
    type: "Point";
    coordinates: { latitude: number, longitude: number }[];
    public constructor(x: number, y: number) {
        this.coordinates = [new Coordinate(x, y)];
    }
}