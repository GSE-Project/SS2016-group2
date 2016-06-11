import * as GeoJson from '../../providers/model/geojson';

export class ViewBusRealTimeData {
    public id: number;
    public delay: number = 0;
    public position: GeoJson.Point;
}