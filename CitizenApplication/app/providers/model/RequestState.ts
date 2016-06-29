/**
 * @author sholzer 160615
 */

import {ICitizenDataObject} from './CitizenDataObject';

export interface IRequestState extends ICitizenDataObject {
    deviceId?: string;
    state: number;
}

export enum RequestStates {
    NotSend,
    Pending,
    Accepted,
    Rejected,
    Completed,
    NotShown
}

// export const RequestStatesMap: RequestStates[] = [
//     RequestStates.Pending,
//     RequestStates.Accepted,
//     RequestStates.Rejected,
//     RequestStates.Completed
// ];