/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016.
 */
import {IStop, IRestDataObject} from '../';

export default IRestStops;

export interface IRestStops extends IRestDataObject {
    stops: IStop[];
}
