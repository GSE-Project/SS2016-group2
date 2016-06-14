/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016 & 13.05.2016.
 * Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
 * Reviewed by skaldo on 04.06.2016 - OK
*/

import {ICitizenDataObject} from './';

export interface IBus extends ICitizenDataObject {
    numberPlate: string;
    lineId: number;
    color: string;
    picture: string;
}