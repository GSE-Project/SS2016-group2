import {RestApiProvider, PersistentDataProvider, CitizenDataService} from '../../../providers/data';
import {IUpdateData, IBus, ILine, IRoute, IStop, IBusRealTimeData, IRestStops, IRestLines, IRestBusses, IRestRoutes} from '../../../providers/model';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Assert, MockFactory} from '../../util';
import {Logger, LoggerFactory} from '../../../providers/logger';
import {ConfigurationService} from '../../../providers/config';

/**
 * Created by sholzer on 06.05.2016.
 * Updated by skaldo on 07.05.2016.
 */

describe('CitizenDataService specifications', function () {

    let restApi: RestApiProvider;
    let storageApi: PersistentDataProvider;
    let config: ConfigurationService = MockFactory.buildConfig(ConfigurationService.DEFAULT_CONFIG);

    describe('Get Server Data', () => {

        let updateCalled: boolean = false;


        /**
         * Stops should be a sufficient test since the code base is equivalent for the other model data
         */
        it('Get stops from server', (done) => {
            let expectedResponse = <IRestStops>{ timeStamp: 1, stops: [{ id: 1 }] };
            let puttedData: IRestStops = { timeStamp: 0, stops: [] };
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
                    return Observable.of({ timeStamp: 0, stops: [] });
                },
                putStops(data: IRestStops): void { puttedData = data; },
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getStops().subscribe(data => {
                    Assert.equalJson(data, expectedResponse.stops, 'Wrong data fetched');
                    Assert.equalJson(puttedData.stops, data, 'Wrong data putted');
                    done();
                });
            });

        });

        it('Get lines from server', (done) => {
            let expectedStops = <IRestStops>{ timeStamp: 1, stops: [{ id: 1 }] };
            let expectedLines = <IRestLines>{ timeStamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ id: 1, delay: 1, position: { type: 'Point', coordinates: [1, 1] }, timeStamp: 0 };
            let puttedData: IRestLines = { timeStamp: 0, lines: [] };

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
                    return Observable.of({ timeStamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { puttedData = data; }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getLines().subscribe(data => {
                    Assert.equalJson(data, expectedLines.lines, 'Wrong data fetched');
                    Assert.equalJson(puttedData.lines, data, 'Wrong data putted');
                    done();
                });
            });
        });

        it('Get lines after stops from server', (done) => {
            let expectedStops = <IRestStops>{ timeStamp: 1, stops: [{ id: 1 }] };
            let expectedResponse = <IRestLines>{ timeStamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ id: 1, delay: 1, position: { type: 'Point', coordinates: [1, 1] }, timeStamp: 0 };

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
                    return Observable.of({ timeStamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getStops().subscribe(stops => {
                    citizenDataService.getLines().subscribe(data => {
                        Assert.equalJson(data, expectedResponse.lines, 'Wrong data fetched');
                        done();
                    });
                });
            });

        });

        /**
         * Check the #updateTimeStamps() method.
         */
        it('Get new update data', (done) => {
            let expectedStops = <IRestStops>{ timeStamp: 1, stops: [{ id: 1 }] };
            let expectedLines = <IRestLines>{ timeStamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ id: 1, delay: 1, position: { type: 'Point', coordinates: [1, 1] }, timeStamp: 0 };
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
                    return Observable.of({ timeStamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);

            updateCalled = false;
            citizenDataService.updateTimeStamps().subscribe(data => {
                Assert.equalJson(updateCalled, true);
                Assert.equalJson(data, expectedUpdateData);
                done();
            });

        });

        it('Get RealTimeBusData', (done) => {
            let expectedStops = <IRestStops>{ timeStamp: 1, stops: [{ id: 1 }] };
            let expectedLines = <IRestLines>{ timeStamp: 1, lines: [] };
            let expectedRealTimeBusData = <IBusRealTimeData>{ id: 1, delay: 1, position: { type: 'Point', coordinates: [1, 1] }, timeStamp: 0 };

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
                    return Observable.of({ timeStamp: 0, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 0, lines: [] });
                },
                putStops(data: IRestStops): void { },
                putLines(data: IRestLines): void { }
            };

            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);
            citizenDataService.getBusRealTimeData(1).subscribe(data => {
                Assert.equalJson(data, expectedRealTimeBusData);
                done();
            });

        });

        it('Get Busses from server', (done) => {
            let expectedBusses = <IRestBusses>{ timeStamp: 1, busses: [] };
            let putBussesCalled: boolean = false;
            let puttedData: IRestBusses = {
                timeStamp: 0, busses: []
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
                    return Observable.of({ timeStamp: 0, busses: [] });
                }
            };


            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getBusses().subscribe(data => {
                    Assert.equalJson(data, expectedBusses.busses, 'Wrong busses fetched');
                    Assert.equalJson(puttedData.busses, data, 'Wrong busses putted');
                    done();
                });
            });
        });
    });


    describe('Get Storage Data', () => {
        it('Get stored lines', (done) => {
            let expectedLines = <IRestLines>{ timeStamp: 2, lines: [{ id: 1 }] };
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 2
                    });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 1, lines: [] });
                }
            };
            storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timeStamp: 1, stops: [] });
                },
                putStops(data: IRestStops): void { },
                getLines(): Observable<IRestLines> {
                    return Observable.of(expectedLines);
                },
                putLines(data: IRestLines): void { }
            };
            let citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                citizenDataService.getLines().subscribe(data => {
                    Assert.equalJson(data, expectedLines.lines);
                    done();
                });
            });
        });
        it('Dont get outdated stops', (done) => {
            let dgos_expectedStops = <IRestStops>{ timeStamp: 2, stops: [{ id: 1 }] };
            let dgos_expectedUpdateData: IUpdateData = { busses: 1, lines: 1, routes: 1, stops: 2 };
            let dgos_restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of(dgos_expectedUpdateData);
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(dgos_expectedStops);
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 1, lines: [] });
                }
            };
            let dgos_storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timeStamp: 1, stops: [] });
                },
                putStops(data: IRestStops): void { },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 2, lines: [] });
                }
            };
            let citizenDataService: CitizenDataService = new CitizenDataService(dgos_restApi, dgos_storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                Assert.equalJson(time.stops, 2);
                citizenDataService.getStops().subscribe(data => {
                    Assert.equalJson(data, dgos_expectedStops.stops);
                    done();
                });
            });
        });

        it('Get current stops from storage', done => {
            // Corresponds to #91
            let dgos_expectedStops = <IRestStops>{ timeStamp: 2, stops: [{ id: 1 }] };
            let dgos_expectedUpdateData: IUpdateData = { busses: 1, lines: 1, routes: 1, stops: 2 };
            let dgos_restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of(dgos_expectedUpdateData);
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timeStamp: 2, stops: [] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 1, lines: [] });
                }
            };
            let dgos_storageApi = <PersistentDataProvider>{
                getStops(): Observable<IRestStops> {
                    return Observable.of(dgos_expectedStops);
                },
                putStops(data: IRestStops): void { },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timeStamp: 2, lines: [] });
                }
            };
            let citizenDataService: CitizenDataService = new CitizenDataService(dgos_restApi, dgos_storageApi, config);
            citizenDataService.updateTimeStamps().subscribe(time => {
                Assert.equalJson(time.stops, 2);
                citizenDataService.getStops().subscribe(data => {
                    Assert.equalJson(data, dgos_expectedStops.stops);
                    done();
                });
            });
        });


        it('Handle null stops', (done) => {
            let updateData = <IUpdateData>{ busses: 2, lines: 2, routes: 2, stops: 0 };
            let expectedStops = <IRestStops>{ timeStamp: 1, stops: [] };
            let cds: CitizenDataService = getTestSetup(
                <RestApiProvider>{
                    getUpdateData() {
                        return Observable.of(updateData);
                    },
                    getStops() {
                        return Observable.of(expectedStops);
                    }
                },
                <PersistentDataProvider>{
                    getStops() {
                        return Observable.of(null);
                    },
                    putStops(arg: any) { }
                }
            );
            cds.updateTimeStamps().subscribe((time) => {
                cds.getStops().subscribe((data) => {
                    Assert.equalJson(data, expectedStops.stops, 'Null not catched');
                    done();
                });
            });
        });
        it('Handle null routes', (done) => {
            let updateData = <IUpdateData>{ busses: 2, lines: 2, routes: 0, stops: 0 };
            let expectedRoutes = <IRestRoutes>{ timeStamp: 1, routes: [] };
            let cds: CitizenDataService = getTestSetup(
                <RestApiProvider>{
                    getUpdateData() {
                        return Observable.of(updateData);
                    },
                    getRoutes() {
                        return Observable.of(expectedRoutes);
                    }
                },
                <PersistentDataProvider>{
                    getRoutes() {
                        return Observable.of(null);
                    },
                    putRoutes(arg: any) { }
                }
            );
            cds.updateTimeStamps().subscribe((time) => {
                cds.getRoutes().subscribe((data) => {
                    Assert.equalJson(data, expectedRoutes.routes, 'Null not catched');
                    done();
                });
            });
        });
        it('Handle null lines', (done) => {
            let updateData = <IUpdateData>{ busses: 2, lines: 0, routes: 0, stops: 0 };
            let expectedData = <IRestLines>{ timeStamp: 1, lines: [] };
            let cds: CitizenDataService = getTestSetup(
                <RestApiProvider>{
                    getUpdateData() {
                        return Observable.of(updateData);
                    },
                    getLines() {
                        return Observable.of(expectedData);
                    }
                },
                <PersistentDataProvider>{
                    getLines() {
                        return Observable.of(null);
                    },
                    putLines(arg: any) { }
                }
            );
            cds.updateTimeStamps().subscribe((time) => {
                cds.getLines().subscribe((data) => {
                    Assert.equalJson(data, expectedData.lines, 'Null not catched');
                    done();
                });
            });
        });
        it('Handle null busses', (done) => {
            let updateData = <IUpdateData>{ busses: 0, lines: 2, routes: 0, stops: 0 };
            let expectedData = <IRestBusses>{ timeStamp: 1, busses: [] };
            let cds: CitizenDataService = getTestSetup(
                <RestApiProvider>{
                    getUpdateData() {
                        return Observable.of(updateData);
                    },
                    getBusses() {
                        return Observable.of(expectedData);
                    }
                },
                <PersistentDataProvider>{
                    getBusses() {
                        return Observable.of(null);
                    },
                    putBusses(arg: any) { }
                }
            );
            cds.updateTimeStamps().subscribe((time) => {
                cds.getBusses().subscribe((data) => {
                    Assert.equalJson(data, expectedData.busses, 'Null not catched');
                    done();
                });
            });
        });
    });



});

function getTestSetup(rap: RestApiProvider, pdp: PersistentDataProvider): CitizenDataService {
    let config: ConfigurationService = MockFactory.buildConfig(ConfigurationService.DEFAULT_CONFIG);
    return new CitizenDataService(rap, pdp, config);
}