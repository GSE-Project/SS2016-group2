import {IBus} from '../../providers/model';
import {ViewObject} from './ViewObject';


export class ViewBus extends ViewObject {
    lineId: number;
    numberPlate: string;
    color: string;
    picture: string;

    constructor(bus: IBus) {
        super(bus);
        this.lineId = bus.lineId;
        this.color = bus.color;
        this.numberPlate = bus.numberPlate;
        this.picture = bus.picture;
    }
}