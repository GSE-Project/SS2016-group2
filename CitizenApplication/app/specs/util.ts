import {IRestBusses} from '../providers/model/rest/RestBusses';
import {IRestLines} from '../providers/model/rest/RestLines';
import {IRestRoutes} from '../providers/model/rest/RestRoutes';
import {IRestStops} from '../providers/model/rest/RestStops';
import {IUpdateData} from '../providers/model/UpdateData';
import {Storage} from 'ionic-angular';
import {RestApiProvider} from '../providers/data/RestApiProvider';
import {IBusRealTimeData} from '../providers/model/BusRealTimeData';
import {GeoJsonObjectTypes} from '../providers/model/geojson/geojsonObject';

import {Http, Response, ResponseOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';


export default Assert;

export class Assert {

    /**
     * Tests if the JSON representation of two objects is equal (we don't need the exact reference but only an equal)
     * @author sholzer 160511 (I wanted an Junit equivalent of assertEquals())
     * @param input :any an object
     * @param expectation :any the object input is expected to be equal
     * @param msg string failure message
     * @return void. Calls fail() if JSON.stringify(input) != JSON.stringify(expectation)
     */
    static equalJson(input: any, expectation: any, msg: string = ''): void {
        if (JSON.stringify(input) !== JSON.stringify(expectation)) {
            fail(msg + ', Expected\n' + JSON.stringify(input) + '\nto be equal to\n' + JSON.stringify(expectation));
        }
    }

    /**
     * Tests if the JSON representation of two objects is  NOT equal (we don't need the exact reference but only an equal)
     * @author sholzer 160511 (I wanted an Junit equivalent of assertEquals())
     * @param input :any an object
     * @param expectation :any the object input is expected NOT to be equal
     * @return void. Calls fail() if JSON.stringify(input) == JSON.stringify(expectation)
     */
    static notEqualJson(input: any, expectation: any): void {
        if (JSON.stringify(input) === JSON.stringify(expectation)) {
            fail('Expected\n' + JSON.stringify(input) + '\nNOT to be equal to\n' + JSON.stringify(expectation));
        }
    }
}

export class MockFactory {

    /**
     * Returns a mocked Storage object
     * @param conf: StorageConfig specifying return values and the answer delay
     * @param putInto: DataConfig a container to store data into 
     * @return {Storage}
     */
    buildStorageMock(conf: StorageConfig, putInto: DataConfig): Storage {
        return <Storage>{
            get(key: string): Promise<string> {
                let value: string = '';
                switch (key) {
                    case 'B': value = JSON.stringify(conf.busses);
                    case 'L': value = JSON.stringify(conf.lines);
                    case 'R': value = JSON.stringify(conf.routes);
                    case 'S': value = JSON.stringify(conf.stops);
                }
                return new Promise(resolve => {
                    setTimeout(() => { resolve(value); }, conf.delay);
                });
            },
            set(key: string, value: string): Promise<any> {
                switch (key) {
                    case 'B': putInto.busses = JSON.parse(value);
                    case 'L': putInto.lines = JSON.parse(value);
                    case 'R': putInto.routes = JSON.parse(value);
                    case 'S': putInto.stops = JSON.parse(value);
                }

                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(key + value);
                    }, conf.delay);
                });
            }
        };
    }

    /**
    * Returns a mocked Storage object
    * @param conf: RestConfig specifying return values and the answer delay
    * @return {Storage}
    */
    buildRestApi(conf: RestConfig): Http {
        return <Http>{
            get(url: string): Observable<Response> {
                let response: Response = new Response(new ResponseOptions({}));
                if (url.endsWith('busses')) {
                    response = new Response(new ResponseOptions({ body: conf.busses }));
                }
                if (url.endsWith('lines')) {
                    response = new Response(new ResponseOptions({ body: conf.lines }));
                }
                if (url.endsWith('routes')) {
                    response = new Response(new ResponseOptions({ body: conf.routes }));
                }
                if (url.endsWith('stops')) {
                    response = new Response(new ResponseOptions({ body: conf.stops }));
                }
                if (url.endsWith('update')) {
                    response = new Response(new ResponseOptions({ body: conf.update }));
                }
                if (url.includes('busses/')) {
                    response = new Response(new ResponseOptions({ body: conf.rt }));
                }
                return Observable.fromPromise(new Promise((resolve) => {
                    setTimeout(() => { resolve(response); }, conf.delay);
                }));
            }
        };
    }

}

export interface DataConfig {
    busses: IRestBusses;
    lines: IRestLines;
    routes: IRestRoutes;
    stops: IRestStops;
}

export interface StorageConfig extends DataConfig {

    delay: number;

}

export interface RestConfig extends StorageConfig {

    update: IUpdateData;
    rt: IBusRealTimeData;

}