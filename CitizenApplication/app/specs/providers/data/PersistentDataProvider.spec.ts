/**
 * @author sholzer 160516
 */
import {PersistentDataProvider} from '../../../providers/data';
import {IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../../../providers/model/rest';
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
        update: 'update'
    },
    storage_api: {
        busses: 'B',
        lines: 'L',
        routes: 'R',
        stops: 'S'
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
            timestamp: 1,
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
            timestamp: 1, busses: []
        };
        let stops: IRestStops = {
            timestamp: 4,
            stops: []
        };
        let lines: IRestLines = {
            timestamp: 2,
            lines: []
        };
        let routes: IRestRoutes = {
            timestamp: 3,
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
            timestamp: 5,
            stops: []
        };

        storageApi = new PersistentDataProvider(config, storage);
        storageApi.putStops(new_stops).subscribe(data => {
            Assert.equalJson(JSON.parse(setData), new_stops);
            done();
        });
    });
});