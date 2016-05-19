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

/**
 * Created by sholzer on 06.05.2016.
 * Updated by skaldo on 07.05.2016.
 */

describe('CitizenDataService specifications', function () {

    var restApi: RestApiProvider;
    var storageApi: PersistentDataProvider;
    describe('Get Server Data', () => {

        var updateCalled: boolean = false;


        /**
         * Stops should be a sufficient test since the code base is equivalent for the other model data
         */
        it('Get stops from server', (done) => {
            var expectedResponse = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };

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
                putStops(data: IRestStops): void { },
            };

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            citizenDataService.getStops().subscribe(data => {
                assertEqualJson(data, expectedResponse);
                done();
            });
        });

        it('Get lines from server', (done) => {
            var expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            var expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            var expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };

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
                putLines(data: IRestLines): void { }
            };

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            citizenDataService.getLines().subscribe(data => {
                assertEqualJson(citizenDataService.getLines(), expectedLines);
            });
        });

        it('Get lines after stops from server', () => {
            var expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            var expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            var expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };

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

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.getStops();
            assertEqualJson(citizenDataService.getLines(), restApi.getLines());
        });

        /**
         * Check the #updateTimeStamps() method.
         */
        it('Get new update data', () => {
            var expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            var expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            var expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };

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

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            updateCalled = false;
            citizenDataService.updateTimeStamps();
            assertEqualJson(updateCalled, true);
        });

        it('Get RealTimeBusData', (done) => {
            var expectedStops = <IRestStops>{ timestamp: 1, stops: [{ id: 1 }] };
            var expectedLines = <IRestLines>{ timestamp: 1, lines: [] };
            var expectedRealTimeBusData = <IBusRealTimeData>{ delay: null, location: {} };

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

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.getBusRealTimeData(1).subscribe(data => {
                assertEqualJson(citizenDataService.getBusRealTimeData(1), restApi.getRealTimeBusData(1));
                done();
            });
        });

        it('Get Busses from server', (done) => {
            var expectedBusses = <IRestBusses>{ timestamp: 1, busses: [] };
            var putBussesCalled: boolean = false;
            var puttedData: IRestBusses = {
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
                }
            };

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.getBusses().subscribe(data => {
                assertEqualJson(data, expectedBusses);
                assertEqualJson(puttedData, data);
                done();
            });

        });
    });


    describe('Get Storage Data', () => {
        it('Get stored lines', () => {
            var expectedStops = <IRestStops>{ timestamp: 2, stops: [{ id: 1 }] };
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 2
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedStops);
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
                    return Observable.of({ timestamp: 1, lines: [] });
                },
                putLines(data: IRestLines): void { }
            };
            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            citizenDataService.getLines().subscribe(data => {
                assertEqualJson(data, expectedStops);
            });
        });
        it('Dont get outdated stops', () => {
            var expectedStops = <IRestStops>{ timestamp: 2, stops: [{ id: 1 }] };
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 2
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of(expectedStops);
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
                    return Observable.of({ timestamp: 2, lines: [] });
                }
            };
            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            // @sholzer, please check this, I'm not sure if I got the point of this test right.
            // as are here calling the assertNotEqualJson method.
            citizenDataService.getStops().subscribe(data => {
                assertNotEqualJson(data, expectedStops);
            });
        });
    });
});



/**
 * Tests if the JSON representation of two objects is equal (we don't need the exact reference but only an equal)
 * @author sholzer 160511 (I wanted an Junit equivalent of assertEquals())
 * @param input :any an object
 * @param expectation :any the object input is expected to be equal
 * @return void. Calls fail() if JSON.stringify(input) != JSON.stringify(expectation)
 */
function assertEqualJson(input: any, expectation: any): void {
    if (JSON.stringify(input) !== JSON.stringify(expectation)) {
        fail('Expected\n' + JSON.stringify(input) + '\nto be equal to\n' + JSON.stringify(expectation));
    }
}

/**
 * Tests if the JSON representation of two objects is  NOT equal (we don't need the exact reference but only an equal)
 * @author sholzer 160511 (I wanted an Junit equivalent of assertEquals())
 * @param input :any an object
 * @param expectation :any the object input is expected NOT to be equal
 * @return void. Calls fail() if JSON.stringify(input) == JSON.stringify(expectation)
 */
function assertNotEqualJson(input: any, expectation: any): void {
    if (JSON.stringify(input) === JSON.stringify(expectation)) {
        fail('Expected\n' + JSON.stringify(input) + '\nNOT to be equal to\n' + JSON.stringify(expectation));
    }
}
