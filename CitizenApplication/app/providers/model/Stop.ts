/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 05.05.2016 and 06.05.2016.
 */

import {Point} from './geojson/Point';
import {CitizenDataServiveObject} from './CitizenDataServiceObject';

export default Stop;

export class Stop  implements CitizenDataServiveObject{
    public id: number;
    public name: string;
    public location: Point;
    public schedule: { lineId: number, time: Date }[];

    fromJSON(json: any) {
        for (var propName in this) {
            // TODO: additional parsing for the schedule needed.
            if (json[propName]) {
                this[propName] = json[propName];
            }
        }
    }
}