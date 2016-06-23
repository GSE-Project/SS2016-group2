/**
 * @author sholzer 160516
 */
import {PersistentDataProvider} from '../../../providers/data';
import {IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../../../providers/model/rest';
import * as Model from '../../../providers/model';
import {IStorage} from '../../../providers/storage';
import {Assert, MockFactory} from '../../util';
import {ConfigurationService} from '../../../providers/config';

const DEFAULT_CONFIG = {
    rest_api: {
        host_url: 'http://localhost:3000',
        busses: 'busses',
        lines: 'lines',
        routes: 'routes',
        rt_data: 'busses/',
        stops: 'stops',
        update: 'update',
        request: 'request',
        post_request: 'request'
    },
    storage_api: {
        busses: 'B',
        citizen_data: 'C',
        lines: 'L',
        routes: 'R',
        stops: 'S',
        request: 'request',
    },
    misc: {
        language: 'de',
        log_level: 'debug',
        log_pretty_print: false
    },
    version: {
        build_number: 'TEST_SNAPSHOT',
        commit: 'DEFAULT_CONFIG',
        release: false
    }
};

describe('PersistentDataProvider specifications', () => {

    let config: ConfigurationService = MockFactory.buildConfig(DEFAULT_CONFIG);

    var storage: IStorage;
    var storageApi: PersistentDataProvider;

    it('Get Stops', (done) => {
        var stops: IRestStops = {
            timeStamp: 1,
            stops: []
        };
        storage = <IStorage>{

            get(key: string): Promise<string> {
                switch (key) {
                    case 'app_version':
                        return Promise.resolve('1');
                    default:
                        return Promise.resolve(JSON.stringify(stops));
                }

            },
            set(key: string, value: string) {
                return undefined;
            },
            clear() { }

        };


        storageApi = new PersistentDataProvider(config, storage);
        storageApi.getStops().subscribe(data => {
            Assert.equalJson(data, stops);
            done();
        });
    });

    it('Put Stops', (done) => {
        let busses: IRestBusses = {
            timeStamp: 1, busses: []
        };
        let stops: IRestStops = {
            timeStamp: 4,
            stops: []
        };
        let lines: IRestLines = {
            timeStamp: 2,
            lines: []
        };
        let routes: IRestRoutes = {
            timeStamp: 3,
            routes: []
        };

        let setData: string = '';
        storage = <IStorage>{

            get(key: string): Promise<string> {
                switch (key) {
                    case 'B':
                        return Promise.resolve(JSON.stringify(busses));
                    case 'L':
                        return Promise.resolve(JSON.stringify(lines));
                    case 'R':
                        return Promise.resolve(JSON.stringify(routes));
                    case 'S':
                        return Promise.resolve(JSON.stringify(stops));
                    case 'app_version':
                        return Promise.resolve('1');
                }
            },

            set(key: string, value: string): Promise<any> {
                console.log('@Storage Mock: called with ' + key + ':' + value);
                switch (key) {
                    case 'app_version':
                        break;
                    default:
                        setData = value;
                }
                return Promise.resolve(undefined);
            },
            clear() {
                console.log('@Storage Mock: cleared');
            }

        };

        var new_stops: IRestStops = {
            timeStamp: 5,
            stops: []
        };

        storageApi = new PersistentDataProvider(config, storage);
        storageApi.putStops(new_stops).subscribe(data => {
            Assert.equalJson(JSON.parse(setData), new_stops);
            done();
        });
    });


    describe('Request Logic', () => {
        let config = DEFAULT_CONFIG;
        let setData: string = '';
        let testReq: Model.IRequestState[] = [
            { id: 0, state: Model.RequestStates.Pending },
            { id: 1, state: Model.RequestStates.Accepted },
            { id: 3, state: Model.RequestStates.Completed }
        ];
        let storage = <IStorage>{
            get(key: string): Promise<string> {
                switch (key) {
                    case config.storage_api.request:
                        return Promise.resolve(JSON.stringify(testReq));
                    default:
                        break;
                }
            },
            set(key: string, value: string) {
                switch (key) {
                    case config.storage_api.request:
                        setData = value;
                        return Promise.resolve();
                    default:
                        break;
                }
            }
        };
        let newReq = <Model.IRequestResponse>{ id: 2 };
        let testPDP = new PersistentDataProvider(MockFactory.buildConfig(config), storage);
        it('Get Requests', done => {
            testPDP.getRequests().subscribe(res => {
                Assert.equalJson(res.length, 2, 'Completed Reqeusts shouldnt be displayed');
                done();
            });
        });
        it('Set Requests', done => {
            testPDP.addRequest(newReq).subscribe(data => {
                let res = <Model.IRequestState[]>JSON.parse(setData);
                Assert.equalJson(res.length, 3, 'Wrong number of RequestStates');
                Assert.equalJson(res.filter(item => item.id === newReq.id ? true : false).length, 1, 'New Item not present');
                done();
            });
        });
        it('Update Request State', done => {
            let newReqState = <Model.IRequestState>{ id: 1, state: 1 };
            testPDP.updateRequest(newReqState).subscribe(data => {
                let res = <Model.IRequestState[]>JSON.parse(setData);
                Assert.equalJson(res.filter(item => item.id === newReqState.id ? true : false)[0].state, newReqState.state);
                done();
            });
        });

    });
});