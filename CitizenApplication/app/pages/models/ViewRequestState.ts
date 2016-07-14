/**
 * @author sholzer 160615
 * Reviewed by skaldo on the 14.07.2016 - minor formatting changes.
 */

import {ViewObject} from './ViewObject';
import {IRequestState} from '../../providers/model';
import * as moment from 'moment/moment';

export class ViewRequestState implements ViewObject {
    id: number;
    state: number;
    pickUpTime: moment.Moment;
    lineId: number;
    busId: number;

    constructor(req: IRequestState) {
        this.id = req.id;
        this.state = req.status;
        this.pickUpTime = moment(req.pickUpTime);
        this.lineId = req.lineId;
        this.busId = req.budId;
    }
}
