/**
 * @author sholzer 160615
 */

import {ICitizenDataObject} from './CitizenDataObject';

export interface IRequestState extends ICitizenDataObject {
    deviceId?: string;
    status: number;
    lineId: number;
    budId: number;
    pickUpTime: number;
}

export enum RequestStates {
    NotSend,
    Pending,
    Accepted,
    Rejected,
    Completed,
    NotShown
}