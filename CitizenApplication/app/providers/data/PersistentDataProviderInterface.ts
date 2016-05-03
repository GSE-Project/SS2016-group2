import Bus from "../model/Bus";
import {UpdateData} from "../model/UpdateData";
import Line from "../model/Line";
/**
 * Created by sholzer on 03.05.2016.
 */


export interface PersistentDataProviderInterface{

    getLastUpdateTimes():UpdateData;
    putLastUpdateTimes(updateTimes:UpdateData):void;

    getBusses():Bus[];
    putBusses(busses:Bus[]):void;

    getLines():Line[];
    putLines(lines:Line[]):void;



}