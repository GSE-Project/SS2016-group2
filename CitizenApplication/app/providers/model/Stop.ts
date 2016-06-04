/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 05.05.2016 and 06.05.2016.
 * Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
 * Reviewed by skaldo on 04.06.2016 - OK
 */
import {ICitizenDataObject} from './';
import {Point} from './geojson';

export default IStop;

export interface IStop extends ICitizenDataObject {
    name: string;
    schedule: {
        lineName: string,
        lineId: number,
        stopId: number,
        arrivingTime: string,
        timestamp: number
    }[];
    location: Point;
    lines: { id: number }[];
}