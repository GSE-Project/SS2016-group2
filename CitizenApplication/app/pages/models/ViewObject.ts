/**
 * ViewLine
 * Author: sholzer, 14.06.2016
 * Reviewed by skaldo on the 14.06.2016 - added IViewObject interface.
 */

import {ICitizenDataObject} from '../../providers/model';

export class ViewObject {
    public id: number;

    constructor(object: ICitizenDataObject) {
        this.id = object.id;
    }
}

export interface IViewObject {
    id: number;
}