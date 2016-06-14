/**
 * ViewLine
 * Author: sholzer, 14.06.2016
 * Reviewed by skaldo on the 14.06.2016 - changed base class to interface.
 */

import {ILine} from '../../providers/model';
import {IViewObject} from './ViewObject';

export class ViewLine implements IViewObject {
    public id: number;
    public name: string;
    public routeId: number;
    public busses: number[];

    constructor(line: ILine) {
        this.id = line.id;
        this.name = line.name;
        this.routeId = line.routeId;
        this.busses = line.busses.slice(0);
    }

}