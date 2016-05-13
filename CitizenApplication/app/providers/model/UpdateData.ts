/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */

import {JsonParsable} from "./JsonParsable";


export class UpdateData implements JsonParsable {
    public busses: number;
    public lines: number;
    public routes: number;
    public stops: number;

    fromJSON(json: any) {
        for (var propName in this) {
            if (json[propName]) {
                this[propName] = json[propName];
            }
        }
    }
}