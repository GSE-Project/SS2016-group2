/**
 * @author sholzer 160611
 */

import * as Data from '../model';
import * as View from '../../pages/models';


export abstract class Mapper {

    static mapStop(stop: Data.IStop): View.ViewStop {
        return new View.ViewStop(stop);
    }

    static mapBus(bus: Data.IBus): View.ViewBus {
        let result: View.ViewBus = new View.ViewBus();
        result.color = bus.color;
        result.id = bus.id;
        result.lineId = bus.lineId;
        result.numberPlate = bus.numberPlate;
        result.picture = bus.picture;
        return result;
    }

}