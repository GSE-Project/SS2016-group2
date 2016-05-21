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

import {ConfigurationService} from '../providers/config/ConfigurationService';
import {CitizenApplicationConfig, RestApiConfig, StorageApiConfig} from '../providers/config/CitizenApplicationConfig';

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
    static buildStorageMock(storage_conf: StorageConfig, putInto: DataConfig, global_conf: StorageApiConfig): Storage {
        return <Storage>{
            get(key: string): Promise<string> {
                let value: string = '';
                switch (key) {
                    case global_conf.busses: value = JSON.stringify(storage_conf.busses);
                        break;
                    case global_conf.lines: value = JSON.stringify(storage_conf.lines);
                        break;
                    case global_conf.routes: value = JSON.stringify(storage_conf.routes);
                        break;
                    case global_conf.stops: value = JSON.stringify(storage_conf.stops);
                }
                return new Promise(resolve => {
                    setTimeout(() => { resolve(value); }, storage_conf.delay);
                });
            },
            set(key: string, value: string): Promise<any> {
                switch (key) {
                    case global_conf.busses: putInto.busses = JSON.parse(value);
                        break;
                    case global_conf.lines: putInto.lines = JSON.parse(value);
                        break;
                    case global_conf.routes: putInto.routes = JSON.parse(value);
                        break;
                    case global_conf.stops: putInto.stops = JSON.parse(value);
                }

                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(key + value);
                    }, storage_conf.delay);
                });
            }
        };
    }

    /**
    * Returns a mocked Storage object
    * @param conf: RestConfig specifying return values and the answer delay
    * @return {Storage}
    */
    static buildRestApi(rest_conf: RestConfig, global_conf: RestApiConfig): Http {
        return <Http>{
            get(url: string): Observable<Response> {
                let response: Response = new Response(new ResponseOptions({}));
                if (url.endsWith(global_conf.busses)) {
                    response = new Response(new ResponseOptions({ body: rest_conf.busses }));
                }
                if (url.endsWith(global_conf.lines)) {
                    response = new Response(new ResponseOptions({ body: rest_conf.lines }));
                }
                if (url.endsWith(global_conf.routes)) {
                    response = new Response(new ResponseOptions({ body: rest_conf.routes }));
                }
                if (url.endsWith(global_conf.stops)) {
                    response = new Response(new ResponseOptions({ body: rest_conf.stops }));
                }
                if (url.endsWith(global_conf.update)) {
                    response = new Response(new ResponseOptions({ body: rest_conf.update }));
                }
                if (url.includes(global_conf.rt_data)) {
                    response = new Response(new ResponseOptions({ body: rest_conf.rt }));
                }
                return Observable.fromPromise(new Promise((resolve) => {
                    setTimeout(() => { resolve(response); }, rest_conf.delay);
                }));
            }
        };
    }

    static buildConfig(config: CitizenApplicationConfig): ConfigurationService {
        return <ConfigurationService>{
            get restApiConfig() {
                return config.rest_api;
            },
            get storageApiConfig() {
                return config.storage_api;
            },
            get miscConfig() {
                return config.misc;
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