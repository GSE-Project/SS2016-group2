import {CitizenDataObject} from "./CitizenDataObject";
/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */
export default Bus;

export interface Bus extends CitizenDataObject {
    numberPlate: string;
    color: string;
    pictureLink: string;
}