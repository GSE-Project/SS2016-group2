import {Http, Response, ResponseOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Assert} from '../util';
import {Storage} from 'ionic-angular';

import {IUpdateData} from '../../providers/model/UpdateData';
import {IBus} from '../../providers/model/Bus';
import {ILine} from '../../providers/model/Line';
import {IRoute} from '../../providers/model/Route';
import {IStop} from '../../providers/model/Stop';
import {IBusRealTimeData} from '../../providers/model/BusRealTimeData';
import {IRestLines} from '../../providers/model/rest/RestLines';
import {IRestBusses} from '../../providers/model/rest/RestBusses';
import {IRestStops} from '../../providers/model/rest/RestStops';
import {IRestRoutes} from '../../providers/model/rest/RestRoutes';

import {Point} from '../../providers/model/geojson/Point';
import {GeoJsonObjectTypes} from '../../providers/model/geojson/geojsonObject';

import {CitizenDataService} from '../../providers/data/CitizenDataService';
import {PersistentDataProvider} from '../../providers/data/PersistentDataProvider';
import {RestApiProvider} from '../../providers/data/RestApiProvider';

/**
 * Specification for the whole data logic. 
 * @author sholzer160518
 * Stubs: http and LocalStorage
 */
describe('Data Logic specification (Integration test)', () => {

    describe('Undelayed access', () => {

        let storageBusses: IRestBusses = { timestamp: 0, busses: [] };
        let storageLines: IRestLines = { timestamp: 0, lines: [] };
        let storageRoutes: IRestRoutes = { timestamp: 0, routes: [] };
        let storageStops: IRestStops = { timestamp: 0, stops: [] };

        let storage: Storage = <Storage>{
            get(key: string): Promise<string> {
                switch (key) {
                    case 'B': return Promise.resolve(JSON.stringify(storageBusses));
                    case 'L': return Promise.resolve(JSON.stringify(storageLines));
                    case 'R': return Promise.resolve(JSON.stringify(storageRoutes));
                    case 'S': return Promise.resolve(JSON.stringify(storageStops));
                }
            },
            set(key: string, value: string): Promise<any> {
                return Promise.resolve(true);
            }
        };

        let serverBusses: IRestBusses = { timestamp: 0, busses: [] };
        let serverLines: IRestLines = { timestamp: 1, lines: [] };
        let serverRoutes: IRestRoutes = { timestamp: 1, routes: [] };
        let serverStops: IRestStops = { timestamp: 1, stops: [] };
        let serverUpdateData: IUpdateData = { busses: 0, lines: 1, routes: 1, stops: 1 };
        let serverBusRealTimeData: IBusRealTimeData = { id: 1, delay: 1, location: { type: GeoJsonObjectTypes.Point, coordinates: [{ longitude: 1, latitude: 1 }] } };

        let http: Http = <Http>{
            get(url: string): Observable<Response> {
                let response: Response = new Response(new ResponseOptions({}));
                if (url.endsWith('busses')) {
                    response = new Response(new ResponseOptions({ body: serverBusses }));
                }
                if (url.endsWith('lines')) {
                    response = new Response(new ResponseOptions({ body: serverLines }));
                }
                if (url.endsWith('routes')) {
                    response = new Response(new ResponseOptions({ body: serverRoutes }));
                }
                if (url.endsWith('stops')) {
                    response = new Response(new ResponseOptions({ body: serverStops }));
                }
                if (url.endsWith('update')) {
                    response = new Response(new ResponseOptions({ body: serverUpdateData }));
                }
                if (url.includes('busses/')) {
                    response = new Response(new ResponseOptions({ body: serverBusRealTimeData }));
                }
                return Observable.of(response);
            }
        };

        let pdp: PersistentDataProvider = new PersistentDataProvider();
        let rap: RestApiProvider = new RestApiProvider(http);
        pdp.setStorage(storage);
        let cds: CitizenDataService = new CitizenDataService(rap, pdp);

        it('Get Stop from Server', () => {
            cds.getStops().subscribe(data => {
                Assert.equalJson(data, serverStops);
            });
        });

        it('Get Busses from Storage', () => {
            cds.getBusses().subscribe(data => {
                Assert.equalJson(data, storageBusses);
            });
        });

        it('Get RealTimeBus data', () => {
            cds.getBusRealTimeData(1).subscribe(data => {
                Assert.equalJson(data, serverBusRealTimeData);
            });
        });
    });

    describe('Delayed access.\n      ! This tests will take some time', () => {

        let storageDelay: number = 500;
        let storageBusses: IRestBusses = { timestamp: 0, busses: [] };
        let storageLines: IRestLines = { timestamp: 0, lines: [] };
        let storageRoutes: IRestRoutes = { timestamp: 0, routes: [] };
        let storageStops: IRestStops = { timestamp: 0, stops: [] };

        let storage: Storage = <Storage>{
            get(key: string): Promise<string> {
                // This should dealy the Promise resolution
                // praise to https://gist.github.com/joepie91/2664c85a744e6bd0629c
                return new Promise((resolve) => {
                    setTimeout(function () {
                        switch (key) {
                            case 'B': resolve(storageBusses);
                            case 'L': resolve(storageLines);
                            case 'R': resolve(storageRoutes);
                            case 'S': resolve(storageStops);
                        }
                    }, storageDelay);
                });
            },
            set(key: string, value: string): Promise<any> {
                return Promise.resolve(true);
            }
        };

        let serverDelay: number = 1000;
        let serverBusses: IRestBusses = { timestamp: 0, busses: [] };
        let serverLines: IRestLines = { timestamp: 1, lines: [] };
        let serverRoutes: IRestRoutes = { timestamp: 1, routes: [] };
        let serverStops: IRestStops = { timestamp: 1, stops: [] };
        let serverUpdateData: IUpdateData = { busses: 0, lines: 1, routes: 1, stops: 1 };
        let serverBusRealTimeData: IBusRealTimeData = { id: 1, delay: 1, location: { type: GeoJsonObjectTypes.Point, coordinates: [{ longitude: 1, latitude: 1 }] } };

        let http: Http = <Http>{
            get(url: string): Observable<Response> {
                let response: Response = new Response(new ResponseOptions({}));
                if (url.endsWith('busses')) {
                    response = new Response(new ResponseOptions({ body: serverBusses }));
                }
                if (url.endsWith('lines')) {
                    response = new Response(new ResponseOptions({ body: serverLines }));
                }
                if (url.endsWith('routes')) {
                    response = new Response(new ResponseOptions({ body: serverRoutes }));
                }
                if (url.endsWith('stops')) {
                    response = new Response(new ResponseOptions({ body: serverStops }));
                }
                if (url.endsWith('update')) {
                    response = new Response(new ResponseOptions({ body: serverUpdateData }));
                }
                if (url.includes('busses/')) {
                    response = new Response(new ResponseOptions({ body: serverBusRealTimeData }));
                }
                return Observable.fromPromise(new Promise((resolve) => {
                    setTimeout(function () {
                        resolve(response);
                    }, serverDelay);
                }));
            }
        };

        let pdp: PersistentDataProvider = new PersistentDataProvider();
        let rap: RestApiProvider = new RestApiProvider(http);
        pdp.setStorage(storage);
        let cds: CitizenDataService = new CitizenDataService(rap, pdp);

        cds.waitForReady().subscribe(res => {
            it('Get Stop from Server', () => {
                cds.getStops().subscribe(data => {
                    Assert.equalJson(data, serverStops);
                });
            });
            it('Get Busses from Storage', () => {
                cds.getBusses().subscribe(data => {
                    Assert.equalJson(data, storageBusses);
                });
            });
            it('Get RealTimeBus data', () => {
                cds.getBusRealTimeData(1).subscribe(data => {
                    Assert.equalJson(data, serverBusRealTimeData);
                });
            });
        });
    });


});

/* Temnplate for Test Setup
let storageBusses: IRestBusses;
        let storageLines: IRestLines;
        let storageRoutes: IRestRoutes;
        let storageStops: IRestStops;

        let storage: Storage = <Storage>{
            get(key: string): Promise<string> {
                switch (key) {
                    case 'B': return Promise.resolve(JSON.stringify(storageBusses));
                    case 'L': return Promise.resolve(JSON.stringify(storageLines));
                    case 'R': return Promise.resolve(JSON.stringify(storageRoutes));
                    case 'S': return Promise.resolve(JSON.stringify(storageStops));
                }
            },
            set(key: string, value: string): Promise<any> {
                return Promise.resolve(true);
            }
        };

        let serverBusses: IRestBusses;
        let serverLines: IRestLines;
        let serverRoutes: IRestRoutes;
        let serverStops: IRestStops;
        let serverUpdateData: IUpdateData;
        let serverBusRealTimeData: IBusRealTimeData;

        let http: Http = <Http>{
            get(url: string): Observable<Response> {
                let response: Response = new Response(new ResponseOptions({}));
                if (url.endsWith('busses')) {
                    response = new Response(new ResponseOptions({ body: serverBusses }));
                }
                if (url.endsWith('lines')) {
                    response = new Response(new ResponseOptions({ body: serverLines }));
                }
                if (url.endsWith('routes')) {
                    response = new Response(new ResponseOptions({ body: serverRoutes }));
                }
                if (url.endsWith('stops')) {
                    response = new Response(new ResponseOptions({ body: serverStops }));
                }
                if (url.endsWith('update')) {
                    response = new Response(new ResponseOptions({ body: serverUpdateData }));
                }
                if (url.includes('busses/')) {
                    response = new Response(new ResponseOptions({ body: serverBusRealTimeData }));
                }
                return Observable.of(response);
            }
        };
        let pdp: PersistentDataProvider = new PersistentDataProvider();
        let rap: RestApiProvider = new RestApiProvider(http);
        pdp.setStorage(storage);
        let cds: CitizenDataService = new CitizenDataService(rap, pdp);
 */