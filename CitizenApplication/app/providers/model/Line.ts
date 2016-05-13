/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */
import {CitizenDataObject} from "./CitizenDataObject";

export default Line;

export interface Line extends CitizenDataObject{
    name: string;
    routeRef: string;
    busses: number[];
}