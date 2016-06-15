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
    info: {
        name: string,
        address: string,
        assistance: number[]
    };
}

export interface IRequestResponse extends ICitizenDataObject {

}