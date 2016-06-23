/**
 * @author sholzer 160615
 */

import {ViewObject} from './ViewObject';
import {IRequestState} from '../../providers/model';

export class ViewRequestState implements ViewObject {

    id: number;
    state: number;

    constructor(req: IRequestState) {
        this.id = req.id;
        this.state = req.state;
    }

}