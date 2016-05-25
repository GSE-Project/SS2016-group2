/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016.
 */
import {IRoute, IRestDataObject} from '../';

export default IRestRoutes;

export interface IRestRoutes extends IRestDataObject {
    routes: IRoute[];
}
