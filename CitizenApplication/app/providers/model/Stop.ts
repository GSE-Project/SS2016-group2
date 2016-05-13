/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 05.05.2016 and 06.05.2016.
 */

import {Point} from './geojson/Point';
import {ICitizenDataObject} from './CitizenDataObject';

export default IStop;

export interface IStop extends ICitizenDataObject {
    name: string;
    location: Point;
    schedule: { lineId: number, time: Date }[];
}
