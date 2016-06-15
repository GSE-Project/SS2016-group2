/**
 * @author sholzer 160615
 */

import {ViewObject} from './ViewObject';
import {IRequest} from '../../providers/model';
import * as GeoJson from '../../providers/model/geojson';

export class ViewRequest implements ViewObject {

    id: number;
    pickUpTime: number;
    location: GeoJson.Point;
    numberOfPersons: number;
    info: {
        name: string,
        address: string,
        assistance: number[]
    };

    constructor(data?: { id: number, pickUpTime: number, location: GeoJson.Point, numberOfPersons: number, info: { name: string, address: string, assistance: number[] } }) {
        if (data) {
            this.id = data.id;
            this.pickUpTime = data.pickUpTime;
            this.location = data.location;
            this.numberOfPersons = data.numberOfPersons;
            this.info = data.info;
        } else {
            this.id = -1;
            this.pickUpTime = 0;
            this.location = { type: 'Point', coordinates: [0, 0] };
            this.numberOfPersons = 0;
            this.info = {
                name: 'Max Mustermann',
                address: 'Musterstrasse 5',
                assistance: []
            };
        }
    }

    /**
     * @return IRequest with empty DeviceID field
     */
    toIRequest(): IRequest {
        return {
            lineId: this.id,
            deviceID: '',
            pickUpTime: this.pickUpTime,
            location: this.location,
            numberOfPersons: this.numberOfPersons,
            info: this.info
        };
    }

}