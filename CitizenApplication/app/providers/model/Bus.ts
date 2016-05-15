/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016 & 13.05.2016.
 */

import {ICitizenDataObject} from './CitizenDataObject';

export interface IBus extends ICitizenDataObject {
    numberPlate: string;
    color: string;
    picture: string;
}

export class Bus implements IBus {
    id: number;
    numberPlate: string;
    color: string;
    picture: string;
}
