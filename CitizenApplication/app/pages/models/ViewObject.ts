import {ICitizenDataObject} from '../../providers/model';

export class ViewObject {

    public id: number;

    constructor(object: ICitizenDataObject) {
        this.id = object.id;
    }

}