import * as GeoJson from '../../providers/model/geojson';
import {IBusRealTimeData} from '../../providers/model';
import {ViewObject} from './ViewObject';

export class ViewBusRealTimeData extends ViewObject {
    public delay: number = 0;
    public position: GeoJson.Point;

    constructor(brtd: IBusRealTimeData) {
        super(brtd);
        this.position = brtd.position;
        if (brtd.delay) {
            this.delay = brtd.delay;
        }
    }
}