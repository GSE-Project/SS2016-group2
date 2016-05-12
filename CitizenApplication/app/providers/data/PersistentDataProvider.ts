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
import {Logger} from 'angular2-logger/core';

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
    constructor(private logger: Logger) {
        // Currently we use LocalStorage. Maybe in a later implementation switch to SqlStorage
        this.storage = new Storage(LocalStorage);
        this.storage.set(STORAGE_ACTIVE, "true");
    }


    /**
     * Access the storage and promised the return of an object of the generic type T
     * @param type: controll key
     * @return Promise<T>
     * @author skaldo & sholzer
     */
    getStorageData<T>(type: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.storage.get(type).then((value) => {
                if (!value) reject("fetched null");
                resolve(<T>JSON.parse(<string>value));
            }).catch((reason) => { reject(reason); });
        });
    }
    
    /**
     * Acces the storage and promises to return an array of objects of the generic type T
     * @param type : controll key
     * @param constructingClass Class to create instances of T (constructingClass extends/implements T)
     * @return Promise<T[]>
     * @author skaldo & sholzer
     */
    getStorageDataArray<T extends JsonParsable>(type: string, constructingClass: { new (): T }): Promise<Array<T>> {
        return new Promise<Array<T>>((resolve, reject) => {
            this.storage.get(type).then((value) => {
                // skaldo 11.05.1016 - added undefined check.
                if (!value) {
                    reject("fetched nulL")
                }
                var result_list: T[] = [];
                JSON.parse(value).forEach(item => {
                    result_list.push(new constructingClass().fromJSON(item));
                }).catch(reason => { reject(reason); });
                resolve(result_list);
            });
        });
    }
    
    /**
     * Puts the promised data array to the storage
     * @param type: controll key
     * @param promised_data promised array
     * @param logInfo: default: type, used for logger output 'Could not do logInfo because ..'
     * @author sholzer
     */
    putStorageDataArray<T>(type:string, promised_data:Promise<T[]>, logInfo:string=type):void{
        promised_data
        .then(value=>{
            this.storage.set(type, JSON.stringify(value)).catch(reason=>{this.logCouldNot("store", logInfo, reason);});
        })
        .catch(reason=>{this.logCouldNot("resolve promised", logInfo, reason);});
    }

    getLastUpdateTimes(): Promise<UpdateData> {
        return this.getStorageData<UpdateData>(STORAGE_TIMESTAMP);
    }
    putLastUpdateTimes(promised_updateTimes: Promise<UpdateData>): void {
        promised_updateTimes.then(value => {
            this.storage.set(STORAGE_TIMESTAMP, JSON.stringify(value)).catch(reason => {
                this.logCouldNot("store", "update data", reason);
            });
        }).catch(reason => {
            this.logCouldNot("resolve promised", "update data", reason);
        });
    }
    getBusses(): Promise<Array<Bus>> {
        return this.getStorageDataArray<Bus>(STORAGE_BUS, Bus);
    }
    putBusses(promised_busses: Promise<Bus[]>) {
        this.putStorageDataArray<Bus>(STORAGE_BUS, promised_busses, "busses");
    }
    getLines(): Promise<Array<Line>> {
        return this.getStorageDataArray<Line>(STORAGE_LINE, Line);
    }
    putLines(promised_lines: Promise<Line[]>) {
        this.putStorageDataArray<Line>(STORAGE_LINE, promised_lines, "lines");
    }
    getStops(): Promise<Array<Stop>> {
        return this.getStorageDataArray<Stop>(STORAGE_STOP, Stop);
    }
    putStops(promised_stops: Promise<Stop[]>) {
        this.putStorageDataArray<Stop>(STORAGE_STOP, promised_stops, "stops");
    }
    getRoutes(): Promise<Array<Route>> {
        return this.getStorageDataArray<Route>(STORAGE_ROUTE, Route);
    }
    putRoutes(promised_routes: Promise<Route[]>) {
        this.putStorageDataArray<Route>(STORAGE_ROUTE, promised_routes, "routes");
    }

    /**
     * Logs a warn message
     * @param type the type that should be fetched
     * @reason the reason of the failed fetch
     */
    private logCouldNot(action: string, type: string, reason: any): void {
        this.logger.warn("Could not {} {} because reason:\n{}", action, type, JSON.stringify(reason));
    }


}