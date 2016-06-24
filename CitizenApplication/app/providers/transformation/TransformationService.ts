/**
 * @author sholzer 1606081950
 * Reviewed by skaldo on the 14.06.2016 - looks good after #84
 * Edited by skaldo on the 19.06.2016 - added param to the delegate method.
 */

import * as VIEW from '../../pages/models';
import {Observable} from 'rxjs/Rx';
import {CitizenDataService} from '../data';
import * as DATA from '../model';
import {Injectable} from '@angular/core';

@Injectable()
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
        return this.getData<DATA.IStop, VIEW.ViewStop>(
            this.cds.getStops(),
            VIEW.ViewStop,
            filterValue,
            filterField
        );
    }

    /**
     * Returns the IBus objects as ViewBus for the UI
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewBus. Is only considered if filterValue is given and non null. Default is 'id'
     * @return Observable<ViewBus[]> containing the transformed stops that matched the given filter (if any) 
     */
    getBusses(filterValue: string = null, filterField: string = 'id'): Observable<VIEW.ViewBus[]> {
        return this.getData<DATA.IBus, VIEW.ViewBus>(
            this.cds.getBusses(),
            VIEW.ViewBus,
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
        return this.getData<DATA.ILine, VIEW.ViewLine>(
            this.cds.getLines(),
            VIEW.ViewLine,
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
        return this.getData<DATA.IRoute, VIEW.ViewRoute>(
            this.cds.getRoutes(),
            VIEW.ViewRoute,
            filterValue,
            filterField);
    }

    /**
     * Returns the BusRealTimeData object parsed to it's view equivalent
     * @param id : number the number of the busses
     * @return Observable<ViewBusRealTimeData>
     */
    getBusRealTimeData(id: number): Observable<VIEW.ViewBusRealTimeData> {
        return this.cds.getBusRealTimeData(id).map<VIEW.ViewBusRealTimeData>((brtd) => { return new VIEW.ViewBusRealTimeData(brtd); });
    }

    /**
     * Delegate for CitizenDataService.updateTimeStamps()
     * skaldo: do we need this delegate? This functionality should be encapsuled in the CDS.
     */
    updateTimeStamps(): Observable<{ busses: number, lines: number, routes: number, stops: number }> {
        return this.cds.updateTimeStamps();
    }

    /**
     * @return Observable<ViewRequestState[]> of not completed requests
     */
    getRequests(): Observable<VIEW.ViewRequestState[]> {
        return this.getData<DATA.IRequestState, VIEW.ViewRequestState>(this.cds.getOpenRequests(), VIEW.ViewRequestState, '', 'id');
    }

    /**
     * @param id: id of the request
     * @return the state of a specified request
     */
    getRequestState(id: number): Observable<VIEW.ViewRequestState> {
        return this.cds.getRequestState(id).map(res => { return new VIEW.ViewRequestState(res); });
    }

    getCitizenData(): Observable<{ name: string, address: string, assistance: number[] }> {
        return this.cds.getCitizenData().map(res => {
            return {
                name: res.userName,
                address: res.userAddress,
                assistance: res.userAssistance
            };
        });
    }

    makeRequest(vreq: VIEW.ViewRequest) {
        this.cds.requestCustomStop(vreq.toIRequest());
    }


    /**
     * Return the {D} objects as {V}[] from the data source
     * @param observableData Observable<{D[]}> data to be transformed
     * @param constructingType {V} to instantiate View Objects
     * @param filterValue? string to be filtered with.
     * @param filterName? string the property to be filtered from the ViewStop. Is only considered if filterValue is given and non null
     * @return Observable<{V}[]> 
     */
    getData<D extends DATA.ICitizenDataObject, V extends VIEW.ViewObject>(observableData: Observable<D[]>, constructingType: typeof VIEW.ViewObject, filterValue: string, filterField: string): Observable<V[]> {
        return observableData.map<V[]>((data) => {
            return data.map<V>(item => { return <V>new constructingType(item); }).filter(this.getFilter<V>(filterValue, filterField));
        }, this);
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