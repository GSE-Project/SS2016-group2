/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016 & 13.05.2016.
 */

import {ICitizenDataObject} from './CitizenDataObject';

export default IBus;

export interface IBus extends ICitizenDataObject {
    numberPlate: string;
    color: string;
    pictureLink: string;
}
