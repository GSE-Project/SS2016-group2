import {RestApiProvider} from '../../../providers/data/RestApiProvider';
import {PersistentDataProvider} from '../../../providers/data/PersistentDataProvider';
import {IUpdateData} from '../../../providers/model/UpdateData';
import {IBus} from '../../../providers/model/Bus';
import {ILine} from '../../../providers/model/Line';
import {IRoute} from '../../../providers/model/Route';
import {IStop} from '../../../providers/model/Stop';

import {Http} from 'angular2/http';
import {IRestStops} from '../../../providers/model/rest/RestStops';
import {Observable} from 'rxjs/Observable';
import {CitizenDataService} from '../../../providers/data/CitizenDataService';
import {IBusRealTimeData} from '../../../providers/model/BusRealTimeData';
import {IRestLines} from '../../../providers/model/rest/RestLines';
import {IRestBusses} from '../../../providers/model/rest/RestBusses';

import {Assert} from '../../util';

/**
 * Created by sholzer on 06.05.2016.
 * Updated by skaldo on 07.05.2016.
 */

describe('CitizenDataService specifications', function () {

    let restApi: RestApiProvider;
    let storageApi: PersistentDataProvider;
    describe('Get Server Data', () => {

        let updateCalled: boolean = false;


        /**
         * Stops should be a sufficient test since the code base is equivalent for the other model data
         */
        it('Get stops from server', (done) => {
            let expectedResponse = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            let puttedData: IRestStops = { timestamp: 0, stops: [] };
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 1
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedResponse);
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                putStops(data: IRestStops): void { puttedData = data; },
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getStops().subscribe(data => {
                    Assert.equalJson(data, expectedResponse, 'Wrong data fetched');
                    Assert.equalJson(puttedData, data, 'Wrong data putted');
                    done();
                });
            });

        });

        it('Get lines from server', (done) => {
            let expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            let expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };
            let puttedData: IRestLines = { timestamp: 0, lines: [] };

            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 1
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedStops);
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of(expectedLines);
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    expectedRealTimeBusData.id = id;
                    return Observable.of(expectedRealTimeBusData);
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { puttedData = data; }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getLines().subscribe(data => {
                    Assert.equalJson(data, expectedLines, 'Wrong data fetched');
                    Assert.equalJson(puttedData, data, 'Wrong data putted');
                    done();
                });
            });
        });

        it('Get lines after stops from server', (done) => {
            let expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            let expectedResponse = <IRestLines>{ timestamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };

            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 0
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedStops);
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of(expectedResponse);
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    expectedRealTimeBusData.id = id;
                    return Observable.of(expectedRealTimeBusData);
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getStops().subscribe(stops => {
                    citizenDataService.getLines().subscribe(data => {
                        Assert.equalJson(data, expectedResponse, 'Wrong data fetched');
                        done();
                    });
                });
            });

        });

        /**
         * Check the #updateTimeStamps() method.
         */
        it('Get new update data', (done) => {
            let expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            let expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };
            let expectedUpdateData: IUpdateData = { busses: 1, lines: 1, routes: 1, stops: 0 };

            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of(expectedUpdateData);
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedStops);
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of(expectedLines);
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    expectedRealTimeBusData.id = id;
                    return Observable.of(expectedRealTimeBusData);
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            updateCalled = false;
            citizenDataService.updateTimeStamps().subscribe(data => {
                Assert.equalJson(updateCalled, true);
                Assert.equalJson(data, expectedUpdateData);
                done();
            });

        });

        it('Get RealTimeBusData', (done) => {
            let expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            let expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };

            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 0
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedStops);
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of(expectedLines);
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    expectedRealTimeBusData.id = id;
                    return Observable.of(expectedRealTimeBusData);
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.getBusRealTimeData(1).subscribe(data => {
                Assert.equalJson(data, expectedRealTimeBusData);
                done();
            });

        });

        it('Get Busses from server', (done) => {
            let expectedBusses = <IRestBusses>{ timestamp: 1, busses: [] };
            let putBussesCalled: boolean = false;
            let puttedData: IRestBusses = {
                timestamp: 0, busses: []
            };
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, stops: 1, routes: 1
                    });
                },

                getBusses(): Observable<IRestBusses> {
                    return Observable.of(expectedBusses);
                }
            };

            storageApi = <PersistentDataProvider>{
                putBusses(data: IRestBusses): void {
                    putBussesCalled = true;
                    puttedData = data;
                },
                getBusses(): Observable<IRestBusses> {
                    return Observable.of({ timestamp: 0, busses: [] });
                }
            };


            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getBusses().subscribe(data => {
                    Assert.equalJson(data, expectedBusses, 'Wrong busses fetched');
                    Assert.equalJson(puttedData, data, 'Wrong busses putted');
                    done();
                });
            });
        });
    });


    describe('Get Storage Data', () => {
        it('Get stored lines', (done) => {
            let expectedLines = <IRestLines>{ timestamp: 2, lines: [{ id: 1 }] };
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 2
                    });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 1, lines: [] });
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [] });
                },
                putStops(data: IRestStops): void { },
                getLines(): Observable<IRestLines> {
                    return Observable.of(expectedLines);
                },
                putLines(data: IRestLines): void { }
            };
            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getLines().subscribe(data => {
                    Assert.equalJson(data, expectedLines);
                    done();
                });
            });
        });
        it('Dont get outdated stops', (done) => {
            let dgos_expectedStops = <IRestStops>{ timestamp: 2, stops: [{ id: 1 }] };
            let dgos_expectedUpdateData: IUpdateData = { busses: 1, lines: 1, routes: 1, stops: 2 };
            let dgos_restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of(dgos_expectedUpdateData);
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(dgos_expectedStops);
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 1, lines: [] });
                }
            };
            let dgos_storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [] });
                },
                putStops(data: IRestStops): void { },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 2, lines: [] });
                }
            };
            let citizenDataService: CitizenDataService = new CitizenDataService(dgos_restApi, dgos_storageApi);
            citizenDataService.updateTimeStamps().subscribe(time => {
                Assert.equalJson(time.stops, 2);
                citizenDataService.getStops().subscribe(data => {
                    Assert.equalJson(data, dgos_expectedStops);
                    done();
                });
            });
        });
    });
});