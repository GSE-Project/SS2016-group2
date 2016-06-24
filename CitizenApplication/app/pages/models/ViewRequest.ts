/**
 * @author sholzer 160615
 * Reviewed by skaldo on the 19.06.2016 - refactored a bit, changed the assistances.
 */

import {ViewObject} from './ViewObject';
import {IRequest, CitizenDataAssistance, Request} from '../../providers/model';
import * as GeoJson from '../../providers/model/geojson';

export class ViewRequest implements ViewObject {
    id: number; // This should be the one we get from server
    lineId: number;
    pickUpTime: Date;
    location: GeoJson.Point;
    numberOfPersons: number;
    info: {
        name: string,
        address: string,
        assistance: {
            wheelchair: boolean,
            shopping: boolean,
            luggage: boolean
        }
    };

    constructor() {
        this.id = -1;
        this.lineId = -1;
        this.pickUpTime = new Date(), // DateTimeUtil.dateToIonicHourMinuteString(new Date(Date.now()));
        this.location = { type: 'Point', coordinates: [0, 0] };
        this.numberOfPersons = 1;
        this.info = {
            name: 'Max Mustermann',
            address: 'Musterstrasse 5',
            assistance: {
                wheelchair: false,
                shopping: false,
                luggage: false
            }
        };
    }

    /**
     * @return IRequest with empty DeviceID field
     */
    toIRequest(): IRequest {
        let req: IRequest = new Request();

        req.lineId = this.lineId;
        req.deviceID = 'random';
        req.pickUpTime = Math.floor(this.pickUpTime.getTime() / 1000);
        req.numberOfPersons = this.numberOfPersons;
        req.location = this.location;
        req.info.userAddress = this.info.address;
        req.info.userName = this.info.name;

        if (this.info.assistance.wheelchair) {
            req.info.userAssistance.push(CitizenDataAssistance.Wheelchair);
        }
        if (this.info.assistance.shopping) {
            req.info.userAssistance.push(CitizenDataAssistance.Shopping);
        }
        if (this.info.assistance.luggage) {
            req.info.userAssistance.push(CitizenDataAssistance.Luggage);
        }

        return req;
    }
}
