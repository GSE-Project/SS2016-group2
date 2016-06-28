/**
 * @author sholzer 1606041501
 */
import {IGeoJsonObject} from './GeoJsonObject';

export default LineString;

export interface LineString extends IGeoJsonObject {
    type: 'LineString';
    coordinates: [number, number][];
}
