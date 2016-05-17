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
        it('Get stops from server', () => {
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 1
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [{ id: 1 }] });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 0, lines: 0, routes: 0, stops: 0
                    };
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                putStops(data: IRestStops): void { }
            };

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            assertEqualJson(citizenDataService.getStops(), restApi.getStops());
        });

        it('Get lines from server', () => {
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 1
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [{ id: 1 }] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 1, lines: [] });
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    return Observable.of({ delay: id, location: {} });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 0, lines: 0, routes: 0, stops: 0
                    };
                },
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
            assertEqualJson(citizenDataService.getLines(), restApi.getLines());
        });

        it('Get lines after stops from server', () => {
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 0
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [{ id: 1 }] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 1, lines: [] });
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    return Observable.of({ delay: id, location: {} });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 0, lines: 0, routes: 0, stops: 0
                    };
                },
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
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 1
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [{ id: 1 }] });
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    return Observable.of({ delay: id, location: {} });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 0, lines: 0, routes: 0, stops: 0
                    };
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                putStops(data: IRestStops): void { }
            };

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            updateCalled = false;
            citizenDataService.updateTimeStamps();
            assertEqualJson(updateCalled, true);
        });

        it('Get RealTimeBusData', () => {
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    updateCalled = true;
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 1
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [{ id: 1 }] });
                },
                getRealTimeBusData(id: number): Observable<IBusRealTimeData> {
                    return Observable.of({ delay: id, location: {} });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 0, lines: 0, routes: 0, stops: 0
                    };
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 0, stops: [] });
                },
                putStops(data: IRestStops): void { }
            };

            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);

            assertEqualJson(citizenDataService.getBusRealTimeData(1), restApi.getRealTimeBusData(1));
        });
    });


    describe('Get Storage Data', () => {
        it('Get stored lines', () => {
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 2
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 2, stops: [{ id: 1 }] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 1, lines: [] });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 1, lines: 1, routes: 1, stops: 1
                    };
                },
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

            assertEqualJson(citizenDataService.getLines(), storageApi.getLines());
        });
        it('Dont get outdated stops', () => {
            restApi = <RestApiProvider>{
                getUpdateData(): Observable<IUpdateData> {
                    return Observable.of({
                        busses: 1, lines: 1, routes: 1, stops: 2
                    });
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 2, stops: [{ id: 1 }] });
                },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 1, lines: [] });
                }
            };
            storageApi = <PersistentDataProvider>{
                getTimeStamps(): IUpdateData {
                    return {
                        busses: 1, lines: 1, routes: 1, stops: 1
                    };
                },
                getStops(): Observable<IRestStops> {
                    return Observable.of({ timestamp: 1, stops: [] });
                },
                putStops(data: IRestStops): void { },
                getLines(): Observable<IRestLines> {
                    return Observable.of({ timestamp: 2, lines: [] });
                }
            };
            var citizenDataService: CitizenDataService = new CitizenDataService(restApi, storageApi);
            assertNotEqualJson(citizenDataService.getStops(), storageApi.getStops());
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
