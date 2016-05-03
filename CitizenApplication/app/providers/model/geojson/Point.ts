/**
 * Created by sholzer on 03.05.2016 after GeoJSon specification
 */

import GeoJSonObject from "./GeoJSonObject.ts";

export default Point;

export class Point implements GeoJSonObject{
    type:"point";
    coordinates:{number, number}[];

    public constructor(x:number, y:number){
        this.coordinates  [{x,y}];
    }
}