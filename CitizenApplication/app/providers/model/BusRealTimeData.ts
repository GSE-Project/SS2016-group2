/*
* @author sholzer on 160510
*/

import {JsonParsable} from './JsonParsable';
import {Point} from './geojson/Point';

export default BusRealTimeData;

export class BusRealTimeData  implements JsonParsable{
    
    public id:number;
    public delay:number;
    public location:Point;
    
     fromJSON(json: any) {
        for (var propName in this) {
            if (json[propName]) {
                this[propName] = json[propName];
            }
        }
    }
    
}