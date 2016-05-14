/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */
import {ICitizenDataObject} from './CitizenDataObject';

export default ILine;

export interface ILine extends ICitizenDataObject {
    name: string;
    routeRef: string;
    busses: number[];
}
