/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016.
 */
import {ILine, IRestDataObject} from '../';

export default IRestLines;

export interface IRestLines extends IRestDataObject {
    lines: ILine[];
}
