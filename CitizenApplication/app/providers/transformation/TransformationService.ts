/**
 * @author sholzer 1606081950
 */

import * as VIEW from '../../pages/models';
import {Observable} from 'rxjs/Rx';
import {CitizenDataService} from '../data';
import * as DATA from '../model';

export class TransformationService {

    constructor(private cds: CitizenDataService) {

    }

    /**
     * Returns the IStop objects as ViewStop for the UI
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null. Default is 'name'
     * @return Observable<ViewStop[]> containing the transformed stops that matched the given filter (if any) 
     */
    getStops(filterValue: string = null, filterField: string = 'name'): Observable<VIEW.ViewStop[]> {
        return this.getData<DATA.IRestStops, DATA.IStop, VIEW.ViewStop>(
            this.cds.getStops(),
            (iRestObject: DATA.IRestStops) => { return iRestObject.stops; },
            TransformationService.mapStop,
            filterValue,
            filterField
        );
        /*return this.cds.getStops().map<VIEW.ViewStop[]>((modelIRStops) => {
            return this.mapData<DATA.IStop, VIEW.ViewStop>(filterValue, filterField, modelIRStops.stops, TransformationService.mapStop);
        }, this);*/
    }

    /**
     * Returns the IBus objects as ViewBus for the UI
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewBus. Is only considered if filterValue is given and non null. Default is 'id'
     * @return Observable<ViewBus[]> containing the transformed stops that matched the given filter (if any) 
     */
    getBusses(filterValue: string = null, filterField: string = 'id'): Observable<VIEW.ViewBus[]> {
        return this.getData<DATA.IRestBusses, DATA.IBus, VIEW.ViewBus>(
            this.cds.getBusses(),
            (iRestObject: DATA.IRestBusses) => { return iRestObject.busses; },
            TransformationService.mapBus,
            filterValue,
            filterField
        );
    }

    /**
     * Return the {D} objects as {V}[] from the data source
     * @param restObservable : Observable<{R}> from the data source to be parsed and filtered.
     * @param iRestObjectsAccess ({R}=>{D}[]) method to retrieve the data model array from the rest model
     * @param map: (data:D)=>V the map of one data logic object to a view object
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null
     * @return Observable<{V}[]> 
     */
    getData<R extends DATA.IRestDataObject, D extends DATA.ICitizenDataObject, V>(restObservable: Observable<R>, iRestObjectsAccess: (iRestObject: R) => D[], map: (data: D) => V, filerValue: string, filterField: string): Observable<V[]> {
        return restObservable.map<V[]>((iRestModel) => {
            return this.mapData<D, V>(filerValue, filterField, iRestObjectsAccess(iRestModel), map);
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
    private mapData<D extends DATA.ICitizenDataObject, V>(filterValue: string, filterField: string, modelData: D[], map: (data: D) => V): V[] {
        return modelData.map<V>((modelItem, i, modelItems) => {
            return map(modelItem);
        }).filter(this.getFilter<V>(filterValue, filterField));
    }

    /**
     * Generic filter method
     * @type V view data type to be filtered
     * @param filterValue? case insensitive string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null
     * @return (data:V)=>boolean that returns true if the filterField value of data matches the RegEx /filterValue/i
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

    static mapBus(bus: DATA.IBus): VIEW.ViewBus {
        let result: VIEW.ViewBus = new VIEW.ViewBus();
        result.color = bus.color;
        result.id = bus.id;
        result.lineId = bus.lineId;
        result.numberPlate = bus.numberPlate;
        result.picture = bus.picture;
        return result;
    }

}
