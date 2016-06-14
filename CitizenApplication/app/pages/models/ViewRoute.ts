/**
 * ViewRoute
 * Author: sholzer, 14.06.2016
 * Reviewed by skaldo on the 14.06.2016 - changed base class to interface.
 */

import * as GeoJson from '../../providers/model/geojson';
import {IRoute} from '../../providers/model';
import {IViewObject} from './ViewObject';

export class ViewRoute implements IViewObject {
    public id: number;
    public route: GeoJson.LineString;

    constructor(route: IRoute) {
        this.id = route.id;
        this.route = route.route;
    }
}
