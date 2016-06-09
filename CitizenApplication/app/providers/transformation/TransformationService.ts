/**
 * @author sholzer 1606081950
 */

import * as VIEW from '../../pages/models';
import {Observable} from 'rxjs/Observable';
import {CitizenDataService} from '../data';
import * as DATA from '../model';

export class TransformationService {

    constructor(private cds: CitizenDataService) {

    }

    /**
     * Returns the IStop objects as ViewStop for the UI
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null
     * @return Observable<ViewStop[]> containing the transformed stops that matched the given filter (if any) 
     */
    getStops(filterValue: string = null, filterField: string = 'name'): Observable<VIEW.ViewStop[]> {
        return this.cds.getStops().map<VIEW.ViewStop[]>((modelIRStops) => {
            return this.mapData<DATA.IStop, VIEW.ViewStop>(filterValue, filterField, modelIRStops.stops, TransformationService.mapStop);
        }, this);
    }

    /**
     * Maps D to V data and filters. This method is designed to be called in an observables map() method
     * @type D extends ICitizenDataObject the data logic type
     * @type V the view type
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null
     * @param modelData :D[] a list of the data logic type objects to be transformed
     * @param map: (data:D)=>V the map of one data logic object to a view object
     * @return V[] a list of filtered view objects
     */
    private mapData<D extends DATA.ICitizenDataObject, V>(filterValue: string = null, filterField: string = 'name', modelData: D[], map: (data: D) => V): V[] {
        return modelData.map<V>((modelItem, i, modelItems) => {
            return map(modelItem);
        }).filter(this.getFilter<V>(filterValue, filterField));
    }

    /**
     * Generic filter method
     * @type V view data type to be filtered
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null
     * @return (data:V)=>boolean that returns true if the filterField value of data is equal to filterValue
     */
    getFilter<V>(filterValue: string = null, filterField: string = 'name'): (data: V) => boolean {
        return (data) => {
            if ((filterValue == null) || (String(data[filterField]).search(new RegExp(filterValue, 'i')) !== -1)) {
                return true;
            }
            return false;
        };
    }

    static mapStop(stop: DATA.IStop): VIEW.ViewStop {
        return new VIEW.ViewStop(stop);
    }

}
