/**
 * Created by sholzer on 03.05.2016.
 * Updated & reviewed by skaldo on 05.05.2016 & 13.05.2016.
 */
import Coordinate from './Coordinate';

export default IGeoJsonObject;

export interface IGeoJsonObject {
    type: GeoJsonObjectTypes;
    coordinates: Coordinate[];
}

export enum GeoJsonObjectTypes {
    'Positions',
    'Point',
    'MultiPoint',
    'LineString',
    'MultiLineString',
    'Polygon',
    'GeometryCollection',
    'GeoJsonObjects'
}
