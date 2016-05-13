/*
* @author sholzer 160510
*/

import {JsonParsable} from "./JsonParsable";
export default CitizenDataServiveObject;

/**
 * Interface to specify that a class can be parsed from a JSON object
 */
export interface CitizenDataServiveObject extends JsonParsable{

    /**
     * The identification number of the object
     */
    id:number;
}
