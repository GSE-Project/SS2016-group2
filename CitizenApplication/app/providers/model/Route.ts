/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 * Adapted by sholzer on 04.06.2016 due to GitHub Issue #66
 */
import {ICitizenDataObject, Point, LineString} from './';

export default IRoute;

export interface IRoute extends ICitizenDataObject {
    route: LineString;
    timestamp: number;
}