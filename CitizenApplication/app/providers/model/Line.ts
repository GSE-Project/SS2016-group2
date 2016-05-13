/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */
import {CitizenDataServiveObject} from './CitizenDataServiceObject';

export default Line;

export class Line implements CitizenDataServiveObject{
    public id: number;
    public name: string;
    public routeRef: string;
    public busses: number[];

    fromJSON(json: any) {
        for (var propName in this) {
            if (json[propName]) {
                this[propName] = json[propName];
            }
        }
    }
}