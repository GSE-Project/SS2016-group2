/**
 * ViewBus
 * Author: sholzer, 14.06.2016
 * Reviewed by skaldo on the 14.06.2016 - changed base class to interface.
 */

import {IBus} from '../../providers/model';
import {IViewObject} from './ViewObject';

export class ViewBus implements IViewObject {
    id: number;
    lineId: number;
    numberPlate: string;
    color: string;
    picture: string;
    totalSeats: number;

    constructor(bus: IBus) {
        /*if (!bus) {
            return;
        }*/
        this.id = bus.id;
        this.lineId = bus.lineId;
        this.color = bus.color;
        this.numberPlate = bus.numberPlate;
        this.picture = bus.picture;
        this.totalSeats = bus.totalSeats;
    }
}
