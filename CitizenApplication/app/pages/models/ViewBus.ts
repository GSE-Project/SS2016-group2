import {IBus} from '../../providers/model';
import {ViewObject} from './ViewObject';


export class ViewBus extends ViewObject {
    lineId: number;
    numberPlate: string;
    color: string;
    picture: string;

    constructor(bus?: IBus) {
        if (bus) {
            super(bus);
            this.lineId = bus.lineId;
            this.color = bus.color;
            this.numberPlate = bus.numberPlate;
            this.picture = bus.picture;
        } else {
            super({ id: -1 });
            this.lineId = -1;
            this.color = 'none';
            this.numberPlate = 'none';
            this.picture = 'http://publicdomainvectors.org/photos/bus-symbol-tobefree.png';
        }
    }
}