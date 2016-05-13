/**
 * Created by steff on 13.05.2016.
 */

export default JsonParsable;

export interface JsonParsable{

    /**
     * Casts a JSON object into an object of this class
     * @param data parsed JSON object
     * @return CitizenDataServiveObject object of this class
     */
    fromJSON(json:any);

}