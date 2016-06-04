/**
 * Created by sholzer on 03.05.2016 after GeoJSon specification.
 * Updated & reviewed by skaldo on 05.05.2016 & 13.05.2016.
 */

import {IGeoJsonObject, GeoJsonObjectTypes, Coordinate} from './';

export default Point;

export interface Point extends IGeoJsonObject {
    type: GeoJsonObjectTypes;
    coordinates: Array<Coordinate>;
}
