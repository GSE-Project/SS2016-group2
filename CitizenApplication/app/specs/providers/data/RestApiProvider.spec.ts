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

import {Http, Response, ResponseOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Assert, MockFactory} from '../../util';

import {ConfigurationService, DEFAULT_CONFIG} from '../../../providers/config/ConfigurationService';

describe('RestApiProvider specifications', () => {

    let config: ConfigurationService = MockFactory.buildConfig(DEFAULT_CONFIG);
    let response: Response;
    let http: Http;
    let loggerFactory = MockFactory.buildLoggerFactory('RAPspec');

    it('Get Stops', (done) => {
        http = <Http>{
            get(url: string): Observable<Response> {
                var response: Response = new Response(
                    new ResponseOptions({ body: { timestamp: 1, stops: [] } })
                );
                var answer: Observable<Response> = Observable.of(response);
                return answer;
            }
        };

        let restApi: RestApiProvider = new RestApiProvider(http, config, loggerFactory);
        restApi.getStops().subscribe(data => {
            Assert.equalJson(data, { timestamp: 1, stops: [] });
            done();
        });
    });

    it('Get timestamps', (done) => {

        let updateData: IUpdateData = {
            busses: 1,
            lines: 1,
            routes: 1,
            stops: 1
        };

        http = <Http>{
            get(url: string): Observable<Response> {
                let response: Response = new Response(
                    new ResponseOptions({ body: updateData })
                );
                let answer: Observable<Response> = Observable.of(response);
                return answer;
            }
        };

        let restApi: RestApiProvider = new RestApiProvider(http, config, loggerFactory);
        restApi.getUpdateData().subscribe(data => {
            Assert.equalJson(data, updateData);
            done();
        });
    });

    it('Get RealTimeData', (done) => {

        let rtData: IBusRealTimeData = {
            id: 1,
            delay: 1,
            location: { type: GeoJsonObjectTypes.Point, coordinates: [{ latitude: 1, longitude: 1 }] }
        };

        http = <Http>{
            get(url: string): Observable<Response> {
                var response: Response = new Response(
                    new ResponseOptions({ body: rtData })
                );
                var answer: Observable<Response> = Observable.of(response);
                return answer;
            }
        };

        let restApi: RestApiProvider = new RestApiProvider(http, config, loggerFactory);
        restApi.getUpdateData().subscribe(data => {
            Assert.equalJson(data, rtData);
            done();
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