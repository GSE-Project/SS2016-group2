/**
 * Created by skaldo on 07.05.2016.
 */
import {PersistentDataProviderInterface} from "./PersistentDataProviderInterface";
import Bus from "../../providers/model/Bus";
import {UpdateData} from "../../providers/model/UpdateData";
import Line from "../../providers/model/Line";
import Stop from "../../providers/model/Stop";
import Route from "../../providers/model/Route";
import {Page, Storage, LocalStorage, Toast, NavController} from 'ionic-angular';

export class PersistentDataProvider implements PersistentDataProviderInterface{
    public local : Storage;
    constructor(){
        this.local = new Storage(LocalStorage);
        this.local["ACTIVE"] = true;
    }
    getLastUpdateTimes(){
        return this.local["TIMESTAMP"];
    }
    putLastUpdateTimes(updateTimes:UpdateData){
        this.local["TIMESTAMP"] = updateTimes;
    }
    getBusses(){
        return this.local["BUS"];
    }
    putBusses(busses:Bus[]){
        this.local["BUS"] = busses;
    }
    getLines(){
        return this.local["LINE"];
    }
    putLines(lines:Line[]){
        this.local["LINE"] = lines;
    }
    getStops(){
        return this.local["STOP"];
    }
    putStops(stops:Stop[]){
        this.local["STOP"] = stops;
    }
    getRoutes(){
        return new Array<Route>();
    }
    putRoutes(routes:Route[]){
        this.local["ROUTE"] = routes;
    }
}