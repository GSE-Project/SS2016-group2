/**
 * Created by skaldo on 07.05.2016.
 */
import {PersistentDataProviderInterface} from "./PersistentDataProviderInterface";
import Bus from "../model/Bus";
import {UpdateData} from "../model/UpdateData";
import Line from "../model/Line";
import Stop from "../model/Stop";
import Route from "../model/Route";

export class PersistentDataProvider implements PersistentDataProviderInterface{
    getLastUpdateTimes(){
        return new UpdateData();
    }
    putLastUpdateTimes(updateTimes:UpdateData){
        return;
    }
    getBusses(){
        return new Array<Bus>();
    }
    putBusses(busses:Bus[]){
        return;
    }
    getLines(){
        return new Array<Line>();
    }
    putLines(lines:Line[]){
        return;
    }
    getStops(){
        return new Array<Stop>();
    }
    putStops(stops:Stop[]){
        return;
    }
    getRoutes(){
        return new Array<Route>();
    }
    putRoutes(routes:Route[]){
        return;
    }
}