/**
* Created by skaldo on 07.05.2016.
*/
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import {UpdateData} from '../model/UpdateData';
import {Bus} from '../model/Bus';
import {Line} from '../model/Line';
import {Route} from '../model/Route';
import {Stop} from '../model/Stop';
import {Point} from '../model/geojson/Point';

export class RestApiProvider implements RestApiProviderInterface {
    constructor() { };
    getUpdateDataFromServer():UpdateData {
        return new UpdateData();
    }
    getBussesFromServer(){
        return new Array<Bus>();
    }
    getLinesFromServer(){
        return new Array<Line>();
    }
    getStopsFromServer(){
        return new Array<Stop>();
    }
    getRoutesFromServer(){
        return new Array<Route>();
    }
    getRealTimeBusData(id: number){
        return { position: new Point(0,0), delay: 0 };
    }
}