/**
 * Created by sholzer on 03.05.2016.
 * Updated & reviewed by skaldo on 05.05.2016 & 13.05.2016.
 * Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
 */
export default IGeoJsonObject;

export interface IGeoJsonObject {
    type: 'Positions' | 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'GeometryCollection' | 'GeoJsonObjects';
    coordinates: [number, number] | [number, number][];
}