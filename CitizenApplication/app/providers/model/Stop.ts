/**
 * Created by sholzer on 03.05.2016.
 */

import Point from './geojson/Point.ts';

export default Stop;

export class Stop{
    public id:number;
    public name:string;
    public location:Point;
    public schedule : {lineId:number, time:number}[];

}