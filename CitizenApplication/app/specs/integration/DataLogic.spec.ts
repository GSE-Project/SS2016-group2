
import {IUpdateData, IRestBusses, IRestLines, IRestRoutes, IRestStops} from '../../providers/model';
import {PersistentDataProvider, RestApiProvider, CitizenDataService} from '../../providers/data';
import {Logger, LoggerFactory} from '../../providers/logger';
import {Assert, MockFactory, DataConfig, StorageConfig, RestConfig} from '../util';
import {IStorage} from '../../providers/storage';
import {Http, Response, ResponseOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ConfigurationService, CitizenApplicationConfig} from '../../providers/config';


/**
 * @author sholzer
 */

const TIMEOUT = 5000;
const DEFAULT_CONFIG: CitizenApplicationConfig = {
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
    }
};

describe('Data Logic Specification with timeout of ' + TIMEOUT + ' ms', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
    tests(0, 0);
    tests(50, 100);

});

function getTestSetup(http: Http, storage: IStorage): CitizenDataService {
    let config: ConfigurationService = MockFactory.buildConfig(DEFAULT_CONFIG);
    let pdp: PersistentDataProvider = new PersistentDataProvider(config, storage);
    let rap: RestApiProvider = new RestApiProvider(http, config);
    return new CitizenDataService(rap, pdp, config);
}

function tests(storageDelay: number, restDelay: number): void {
    describe('Tests with \nserver delay of ' + restDelay + 'ms'
        + '\nstorage delay of ' + storageDelay + ' ms', () => {
            let storageConf = <StorageConfig>{
                delay: storageDelay,
                busses: { timestamp: 1, busses: [] },
                lines: { timestamp: 1, lines: [] },
                routes: { timestamp: 1, routes: [] },
                stops: { timestamp: 1, stops: [] }
            };
            let restConf = <RestConfig>{
                delay: restDelay,
                busses: { timestamp: 1, busses: [] },
                lines: { timestamp: 2, lines: [] },
                routes: { timestamp: 1, routes: [] },
                stops: { timestamp: 2, stops: [] },
                update: { busses: 1, lines: 2, routes: 1, stops: 2 },
                rt: { id: 1, delay: 10, location: {} }
            };

            it('Get Stops from Server', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                debugger;
                cds.updateTimeStamps().subscribe(time => {
                    cds.getStops().subscribe(stops => {
                        Assert.equalJson(stops, restConf.stops);
                        done();
                    });
                });
            });
            it('Get Lines from Server', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getLines().subscribe(data => {
                        Assert.equalJson(data, restConf.lines);
                        done();
                    });
                });
            });
            it('Get subsequent lines from Server', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getStops().subscribe(stops => {
                        cds.getLines().subscribe(lines => {
                            Assert.equalJson(lines, restConf.lines);
                            done();
                        });
                    });
                });
            });
            it('Get BusRealTimeData from Server', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.getBusRealTimeData(1).subscribe(rt => {
                    Assert.equalJson(rt, restConf.rt);
                    done();
                });
            });
            it('Get UpdateData from Server', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    Assert.equalJson(time, restConf.update);
                    done();
                });
            });
            it('Get Busses from Storage', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getBusses().subscribe(busses => {
                        Assert.equalJson(busses, storageConf.busses);
                        done();
                    });
                });
            });
            it('Get Routes from Storage', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getRoutes().subscribe(routes => {
                        Assert.equalJson(routes, storageConf.routes);
                        done();
                    });
                });
            });
            it('Get subsequent routes from Storage', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getBusses().subscribe(busses => {
                        cds.getRoutes().subscribe(routes => {
                            Assert.equalJson(routes, storageConf.routes);
                            done();
                        });
                    });
                });
            });
            it('Storage access after Server access', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getStops().subscribe(stops => {
                        cds.getBusses().subscribe(busses => {
                            Assert.equalJson(busses, storageConf.busses);
                            done();
                        });
                    });
                });
            });
            it('Server access after Storage access', (done) => {
                let storagePuts = <DataConfig>{};
                let cds = getTestSetup(
                    MockFactory.buildRestApi(restConf, DEFAULT_CONFIG.rest_api),
                    MockFactory.buildStorageMock(storageConf, storagePuts, DEFAULT_CONFIG.storage_api)
                );
                cds.updateTimeStamps().subscribe(time => {
                    cds.getBusses().subscribe(busses => {
                        cds.getStops().subscribe(stops => {
                            Assert.equalJson(stops, restConf.stops);
                            done();
                        });
                    });
                });
            });
        });
}