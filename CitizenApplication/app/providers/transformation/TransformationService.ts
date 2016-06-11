/**
 * @author sholzer 1606081950
 */

import * as VIEW from '../../pages/models';
import {Observable} from 'rxjs/Rx';
import {CitizenDataService} from '../data';
import * as DATA from '../model';
import {Mapper} from './Mapper';

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
            Mapper.mapStop,
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
            Mapper.mapBus,
            filterValue,
            filterField
        );
    }

    /**
     * Returns the Iline objects as ViewLine for the UI
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewLine. Is only considered if filterValue is given and non null. Default is 'name'
     * @return Observable<ViewLine[]> containing the transformed stops that matched the given filter (if any) 
     */
    getLines(filterValue: string = null, filterField: string = 'id') {
        return this.getData<DATA.IRestLines, DATA.ILine, VIEW.ViewLine>(
            this.cds.getLines(),
            (iRestObject: DATA.IRestLines) => { return iRestObject.lines; },
            Mapper.mapLine,
            filterValue,
            filterField);
    }

    /**
     * Returns the Iline objects as ViewLine for the UI
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewLine. Is only considered if filterValue is given and non null. Default is 'name'
     * @return Observable<ViewLine[]> containing the transformed stops that matched the given filter (if any) 
     */
    getRoutes(filterValue: string = null, filterField: string = 'id') {
        return this.getData<DATA.IRestRoutes, DATA.IRoute, VIEW.ViewRoute>(
            this.cds.getRoutes(),
            (iRestObject: DATA.IRestRoutes) => { return iRestObject.routes; },
            Mapper.mapRoute,
            filterValue,
            filterField);
    }

    /**
     * Returns the BusRealTimeData object parsed to it's view equivalent
     * @param id : number the number of the busses
     * @return Observable<ViewBusRealTimeData>
     */
    getBusRealTimeData(id: number): Observable<VIEW.ViewBusRealTimeData> {
        return this.cds.getBusRealTimeData(id).map<VIEW.ViewBusRealTimeData>((brtd) => { return Mapper.mapBRTData(brtd); });
    }

    updateTimeStamps(): Observable<{ busses: number, lines: number, routes: number, stops: number }> {
        return this.cds.updateTimeStamps();
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
}
