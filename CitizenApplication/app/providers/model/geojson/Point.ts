/**
 * Created by sholzer on 03.05.2016 after GeoJSon specification.
 * Updated & reviewed by skaldo on 05.05.2016.
 */

import {GeoJSonObject} from './GeoJSonObject';
import {Coordinate} from './Coordinate';

export default Point;

export class Point implements GeoJSonObject {
    type: "Point";
    coordinates: Array<Coordinate>;
    constructor(x: number, y: number) {
        this.coordinates = [new Coordinate(x, y)];
    }
}