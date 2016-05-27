/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */
import {ICitizenDataObject, Point} from './';

export default IRoute;

export interface IRoute extends ICitizenDataObject {
    gpsData: Point[];
}
