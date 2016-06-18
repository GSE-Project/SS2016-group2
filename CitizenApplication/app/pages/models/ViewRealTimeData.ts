/**
 * ViewRealTimeData
 * Author: sholzer, 14.06.2016
 * Reviewed by skaldo on the 14.06.2016 - changed base class to interface.
 */

import * as GeoJson from '../../providers/model/geojson';
import {IBusRealTimeData} from '../../providers/model';
import {IViewObject} from './ViewObject';

export class ViewBusRealTimeData implements IViewObject {
    public id: number;
    public delay: number = 0;
    public position: GeoJson.Point;
    public takenSeats: number;

    constructor(brtd: IBusRealTimeData) {
        this.id = brtd.id;
        this.position = brtd.position;
        this.takenSeats = brtd.takenSeats;
        if (brtd.delay) {
            this.delay = brtd.delay;
        }
    }
}