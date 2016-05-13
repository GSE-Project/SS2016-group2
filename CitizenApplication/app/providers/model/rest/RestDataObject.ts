import {CitizenDataObject} from "../CitizenDataObject";
/**
 * Created by steff on 13.05.2016.
 */

export default RestDataObject;

export interface RestDataObject {

    timestamp:number;

    data:CitizenDataObject[];

}