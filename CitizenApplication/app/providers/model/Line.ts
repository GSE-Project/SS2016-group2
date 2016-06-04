/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 * Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
 */
import {ICitizenDataObject} from './';

export default ILine;

export interface ILine extends ICitizenDataObject {
    name: string;
    routeId: number;
    timestamp: number;
    busses: number[];
}
