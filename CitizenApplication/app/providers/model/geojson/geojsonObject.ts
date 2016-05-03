/**
 * Created by sholzer on 03.05.2016.
 */

export default GeoJSonObject;

export interface GeoJSonObject {
    type:["Positions", "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"];
    coordinates:{number, number}[];
}