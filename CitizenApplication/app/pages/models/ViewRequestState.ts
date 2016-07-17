/**
 * @author sholzer 160615
 * Reviewed by skaldo on the 14.07.2016 - minor formatting changes.
 */

import {ViewObject} from './ViewObject';
import {IRequestState} from '../../providers/model';
import * as moment from 'moment/moment';

export enum ViewRequestStates {
    'StatePending' = 1,
    'StateAccepting' = 2,
    'StateRejected' = 3,
    'StateCompleted' = 4
}

export class ViewRequestState implements ViewObject {
    id: number;
    state: string;
    pickUpTime: moment.Moment;
    lineId: number;
    busId: number;

    constructor(req: IRequestState) {
        this.id = req.id;
        this.state = ViewRequestStates[req.status];
        this.pickUpTime = moment(req.pickUpTime);
        this.lineId = req.lineId;
        this.busId = req.budId;
    }
}
