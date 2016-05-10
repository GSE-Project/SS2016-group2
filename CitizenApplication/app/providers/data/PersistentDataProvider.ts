/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 * 
 */
import {PersistentDataProviderInterface} from "./PersistentDataProviderInterface";
import Bus from "../../providers/model/Bus";
import {UpdateData} from "../../providers/model/UpdateData";
import Line from "../../providers/model/Line";
import Stop from "../../providers/model/Stop";
import Route from "../../providers/model/Route";
import {Page, Storage, LocalStorage, Toast, NavController} from 'ionic-angular';

const STORAGE_ACTIVE = "A";
const STORAGE_TIMESTAMP = "T";
const STORAGE_BUS = "B";
const STORAGE_LINE = "L";
const STORAGE_STOP = "S";
const STORAGE_ROUTE = "R";

export class PersistentDataProvider implements PersistentDataProviderInterface {



    /**
     * Generic Storage interface. 
     */
    public storage: Storage;
    constructor() {
        // Currently we use LocalStorage. Maybe in a later implementation switch to SqlStorage
        this.storage = new Storage(LocalStorage);
        this.storage.set(STORAGE_ACTIVE, "true");
    }
    
    
    getStorageData<T>(type:string):Promise<T>{
        return new Promise<T>(resolve=>{
           this.storage.get(type).then((value)=>{
               return <T>JSON.parse(<string>value);
           })
        });
    }
    
    getLastUpdateTimes():Promise<UpdateData> {
        return this.getStorageData<UpdateData>(STORAGE_TIMESTAMP);
    }
    putLastUpdateTimes(updateTimes: UpdateData) {
        this.storage.set(STORAGE_BUS, JSON.stringify(updateTimes));
    }
    getBusses():Promise<Array<Bus>> {
        return this.getStorageData<Array<Bus>>(STORAGE_BUS);
    }
    putBusses(busses: Bus[]) {
        this.storage.set(STORAGE_BUS, JSON.stringify(busses));
    }
    getLines():Promise<Array<Line>> {
        return this.getStorageData<Array<Line>>(STORAGE_LINE);
    }
    putLines(lines: Line[]) {
        this.storage.set(STORAGE_LINE, JSON.stringify(lines));
    }
    getStops() :Promise<Array<Stop>>{
        return this.getStorageData<Array<Stop>>(STORAGE_STOP);
    }
    putStops(stops: Stop[]) {
        this.storage.set(STORAGE_STOP, JSON.stringify(stops));
    }
    getRoutes() :Promise<Array<Route>>{
        return this.getStorageData<Array<Route>>(STORAGE_ROUTE);
    }
    putRoutes(routes: Route[]) {
        this.storage.set(STORAGE_ROUTE, JSON.stringify(routes));
    }
}