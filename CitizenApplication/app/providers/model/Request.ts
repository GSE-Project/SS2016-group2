import * as GeoJson from './geojson';

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