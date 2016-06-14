import {ILine} from '../../providers/model';
import {ViewObject} from './ViewObject';

export class ViewLine extends ViewObject {
    public name: string;
    public routeId: number;
    public busses: number[];

    constructor(line: ILine) {
        super(line);
        this.name = line.name;
        this.routeId = line.routeId;
        this.busses = line.busses.slice(0);
    }

}