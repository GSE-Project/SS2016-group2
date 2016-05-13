/*
* @author sholzer 160510
*/
export default CitizenDataServiveObject;

/**
 * Interface to specify that a class can be parsed from a JSON object
 */
export interface CitizenDataServiveObject{

    /**
     * The identification number of the object
     */
    id:number;
    
    /**
     * Casts a JSON object into an object of this class
     * @param data parsed JSON object
     * @return CitizenDataServiveObject object of this class
     */
    fromJSON(json:any);
    
}
