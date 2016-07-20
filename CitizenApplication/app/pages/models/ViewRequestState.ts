/**
 * @author sholzer 160615
 * Reviewed by skaldo on the 14.07.2016 - minor formatting changes.
 */

import {ViewObject} from './ViewObject';
import {IRequestState} from '../../providers/model';
import * as moment from 'moment/moment';

export enum ViewRequestStates {
    'Pending' = 1,
    'Accepting' = 2,
    'Rejected' = 3,
    'Completed' = 4,
    'NotShownUp' = 5,
    'Cancelled' = 6
}

export class ViewRequestState implements ViewObject {
    id: number;
    state: string;
    pickUpTime: moment.Moment;
    lineId: number;
    acceptingBus: number;

    constructor(req: IRequestState) {
        this.id = req.id;
        this.state = ViewRequestStates[req.status];
        this.pickUpTime = moment(req.pickUpTime);
        this.lineId = req.lineId;
        this.acceptingBus = req.acceptingBus;
    }
}
