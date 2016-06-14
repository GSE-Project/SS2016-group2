import * as GeoJson from '../../providers/model/geojson';
import {IRoute} from '../../providers/model';
import {ViewObject} from './ViewObject';

export class ViewRoute extends ViewObject {

    public route: GeoJson.LineString;

    constructor(route: IRoute) {
        super(route);
        this.route = route.route;
    }

}