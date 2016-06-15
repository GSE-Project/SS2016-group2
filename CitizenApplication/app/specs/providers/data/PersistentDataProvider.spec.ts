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
        update: 'update',
        request: 'request',
        post_request: 'request'
    },
    storage_api: {
        busses: 'B',
        lines: 'L',
        routes: 'R',
        stops: 'S',
        request: 'request',
    },
    misc: {
        language: 'de',
        log_level: 'debug',
        log_pretty_print: false
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
                return Promise.resolve(JSON.stringify(stops));
            }

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
                }
            },

            set(key: string, value: string): Promise<any> {
                setData = value;
                return Promise.resolve(stops);
            }

        };

        var new_stops: IRestStops = {
            timestamp: 5,
            stops: []
        };

        storageApi = new PersistentDataProvider(config, storage);
        storageApi.putStops(new_stops);
        setTimeout(() => {
            Assert.equalJson(JSON.parse(setData), new_stops);
            done();
        }, 100);
    });
});