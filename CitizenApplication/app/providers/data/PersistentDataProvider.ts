/**
 * Created by skaldo on 07.05.2016.
 * Implemented by tim.dellmann
 * 
 */
import {Injectable} from 'angular2/core';
import {PersistentDataProviderInterface} from "./PersistentDataProviderInterface";
import {Bus} from "../../providers/model/Bus";
import {UpdateData} from "../../providers/model/UpdateData";
import {Line} from "../../providers/model/Line";
import {Stop} from "../../providers/model/Stop";
import {Route} from "../../providers/model/Route";
import {Page, Storage, LocalStorage, Toast, NavController} from 'ionic-angular';
import {JsonParsable} from "../model/JsonParsable";

const STORAGE_ACTIVE = "A";
const STORAGE_TIMESTAMP = "T";
const STORAGE_BUS = "B";
const STORAGE_LINE = "L";
const STORAGE_STOP = "S";
const STORAGE_ROUTE = "R";

@Injectable()
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
    
    getStorageDataArray<T extends JsonParsable>(type:string, constructingClass:{new():T}):Promise<Array<T>>{
        return new Promise<Array<T>>(resolve=>{
            this.storage.get(type).then((value)=>{
                // skaldo 11.05.1016 - added undefined check.
                if(!value){
                    return null;
                }
                var result_list : T[] = [];
                JSON.parse(value).forEach(item=> {
                    result_list.push(new constructingClass().fromJSON(item));
                });
                return result_list;
            });
        });
    }
    
    getLastUpdateTimes():Promise<UpdateData> {
        return this.getStorageData<UpdateData>(STORAGE_TIMESTAMP);
    }
    putLastUpdateTimes(updateTimes: UpdateData) {
        this.storage.set(STORAGE_BUS, JSON.stringify(updateTimes));
    }
    getBusses():Promise<Array<Bus>> {
        return this.getStorageDataArray<Bus>(STORAGE_BUS, Bus);
    }
    putBusses(busses: Bus[]) {
        this.storage.set(STORAGE_BUS, JSON.stringify(busses));
    }
    getLines():Promise<Array<Line>> {
        return this.getStorageDataArray<Line>(STORAGE_LINE, Line);
    }
    putLines(lines: Line[]) {
        this.storage.set(STORAGE_LINE, JSON.stringify(lines));
    }
    getStops() :Promise<Array<Stop>>{
        return this.getStorageDataArray<Stop>(STORAGE_STOP, Stop);
    }
    putStops(stops: Stop[]) {
        this.storage.set(STORAGE_STOP, JSON.stringify(stops));
    }
    getRoutes() :Promise<Array<Route>>{
        return this.getStorageDataArray<Route>(STORAGE_ROUTE, Route);
    }
    putRoutes(routes: Route[]) {
        this.storage.set(STORAGE_ROUTE, JSON.stringify(routes));
    }
}