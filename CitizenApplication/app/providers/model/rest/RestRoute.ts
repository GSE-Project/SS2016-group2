import {RestDataObject} from "./RestDataObject";
import {Route} from "../Route";
/**
 * Created by steff on 13.05.2016.
 */

export default RestRoutes;

export interface RestRoutes extends RestDataObject {
    data:Route[];
}