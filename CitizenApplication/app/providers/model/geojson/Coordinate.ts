/**
 * Created by sholzer on 03.05.2016.
 */

export default Coordinate;

export class Coordinate{
    latitude : number;
    longitude: number;

    constructor(lat:number, lon:number){
        this.latitude = lat;
        this.longitude = lon;
    }
}