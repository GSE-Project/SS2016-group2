/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016.
 */

import {IRestDataObject} from "./RestDataObject";
import {IRoute} from "../Route";

export default IRestRoutes;

export interface IRestRoutes extends IRestDataObject {
    routes: IRoute[];
}
