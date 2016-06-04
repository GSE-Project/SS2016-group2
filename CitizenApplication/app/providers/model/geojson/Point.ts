/**
 * Created by sholzer on 03.05.2016 after GeoJSon specification.
 * Updated & reviewed by skaldo on 05.05.2016 & 13.05.2016.
 * Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
 */

import {IGeoJsonObject} from './GeoJsonObject';

export default Point;

export interface Point extends IGeoJsonObject {
    type: 'Point';
    coordinates: [number, number];
}
