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

    static mapLine(line: Data.ILine): View.ViewLine {
        let result = new View.ViewLine();
        result.id = line.id;
        result.name = line.name;
        result.routeId = line.routeId;
        result.busses = line.busses.slice(0);
        return result;
    }

    static mapRoute(route: Data.IRoute): View.ViewRoute {
        let result = new View.ViewRoute();
        result.id = route.id;
        result.route = route.route;
        return result;
    }

    static mapBRTData(brtd: Data.IBusRealTimeData): View.ViewBusRealTimeData {
        let result = new View.ViewBusRealTimeData();
        result.id = brtd.id;
        result.position = brtd.position;
        if (brtd.delay) {
            result.delay = brtd.delay;
        }
        return result;
    }

}