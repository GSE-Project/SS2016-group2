/**
 * @sholzer 160614
 */

import * as GeoJson from './geojson';
import {ICitizenDataObject} from './CitizenDataObject';

export interface IRequest {
    lineId: number;
    pickUpTime: number;
    location: GeoJson.Point;
    numberOfPersons: number;
    deviceID: string;
    info: ICitizenData;
}

export class Request implements IRequest {
    lineId: number;
    pickUpTime: number;
    location: GeoJson.Point;
    numberOfPersons: number;
    deviceID: string;
    info: ICitizenData;

    constructor() {
        this.info = new CitizenData();
    }
}

export interface IRequestResponse extends ICitizenDataObject {

}

export interface ICitizenData {
    name: string;
    address: string;
    assistance: number[];
}

export class CitizenData {
    name: string;
    address: string;
    assistance: number[];
}

export enum CitizenDataAssistance {
    Luggage = 0,
    Wheelchair = 1,
    Shopping = 2
}