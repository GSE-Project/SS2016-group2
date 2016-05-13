/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016.
 */

import {IRestDataObject} from "./RestDataObject";
import {ILine} from "../Line";

export default IRestLines;

export interface IRestLines extends IRestDataObject {
    lines: ILine[];
}
