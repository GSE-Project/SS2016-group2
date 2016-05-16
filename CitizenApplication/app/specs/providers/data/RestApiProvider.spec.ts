/**
 * @author sholzer 160515
 * References:
 * https://angular.io/docs/js/latest/api/http/Http-class.html
 * https://angular.io/docs/js/latest/api/http/Response-class.html
 * https://angular.io/docs/ts/latest/api/http/ResponseOptions-class.html
 */

import {RestApiProvider} from '../../../providers/data/RestApiProvider';
import {IUpdateData} from '../../../providers/model/UpdateData';
import {IBusRealTimeData} from '../../../providers/model/BusRealTimeData';
import {GeoJsonObjectTypes} from '../../../providers/model/geojson/geojsonObject';

import {Http, Response, ResponseOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Assert} from '../../util';

describe('RestApiProvider specifications', () => {

    var response: Response;

    var http: Http;

    it('Get Stops', () => {
        http = <Http>{
            get(url: string): Observable<Response> {
                var response: Response = new Response(
                    new ResponseOptions({ body: { timestamp: 1, stops: [] } })
                );
                var answer: Observable<Response> = Observable.of(response);
                debugger;
                return answer;
            }
        };

        var restApi: RestApiProvider = new RestApiProvider(http);
        // Not beautiful but it works
        restApi.getStops().subscribe(data => {
            Assert.equalJson(data, { timestamp: 1, stops: [] });
        });
    });

    it('Get timestamps', () => {

        var updateData: IUpdateData = {
            busses: 1,
            lines: 1,
            routes: 1,
            stops: 1
        };

        http = <Http>{
            get(url: string): Observable<Response> {
                var response: Response = new Response(
                    new ResponseOptions({ body: updateData })
                );
                var answer: Observable<Response> = Observable.of(response);
                debugger;
                return answer;
            }
        };

        var restApi: RestApiProvider = new RestApiProvider(http);
        // Not beautiful but it works
        restApi.getUpdateData().subscribe(data => {
            Assert.equalJson(data, updateData);
        });
    });

    it('Get RealTimeData', () => {

        var rtData: IBusRealTimeData = {
            id: 1,
            delay: 1,
            location: {type: GeoJsonObjectTypes.Point, coordinates: [{ latitude: 1, longitude: 1 }] }
        };

        http = <Http>{
            get(url: string): Observable<Response> {
                var response: Response = new Response(
                    new ResponseOptions({ body: rtData })
                );
                var answer: Observable<Response> = Observable.of(response);
                debugger;
                return answer;
            }
        };

        var restApi: RestApiProvider = new RestApiProvider(http);
        // Not beautiful but it works
        restApi.getUpdateData().subscribe(data => {
            Assert.equalJson(data, rtData);
        });
    });


});

class MyResponse extends Response {

    internalObject: any;

    constructor(body: any) {
        super(new ResponseOptions({ body }));
        this.internalObject = body;
    }

    json(): any {
        return this.internalObject;
    }

}