/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016.
 */
import {IBus, IRestDataObject} from '../';

export default IRestBusses;

export interface IRestBusses extends IRestDataObject {
    busses: IBus[];
}
