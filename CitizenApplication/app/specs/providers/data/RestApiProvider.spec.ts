/**
 * @author sholzer 160515
 * References:
 * https://angular.io/docs/js/latest/api/http/Http-class.html
 * https://angular.io/docs/js/latest/api/http/Response-class.html
 * https://angular.io/docs/ts/latest/api/http/ResponseOptions-class.html
 */

import {RestApiProvider} from '../../../providers/data/RestApiProvider';

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