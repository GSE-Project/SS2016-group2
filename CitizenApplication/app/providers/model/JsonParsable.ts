/*
* @author sholzer 160510
*/
export default JsonParsable;

/**
 * Interface to specify that a class can be parsed from a JSON object
 */
export interface JsonParsable{
    
    /**
     * Casts a JSON object into an object of this class
     * @param data parsed JSON object
     * @return JsonParsable object of this class
     */
    fromJSON(json:any);
    
}
