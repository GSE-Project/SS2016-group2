import CitizenDataServiceInterface from "../../../providers/data/CitizenDataServiceInterface";
import {RestApiProvider} from "../../../providers/data/RestApiProvider";
import {PersistentDataProvider} from "../../../providers/data/PersistentDataProvider";
import {CitizenDataService, CitizenDataCache} from "../../../providers/data/CitizenDataService";
import {UpdateData} from "../../../providers/model/UpdateData";
import {Bus} from "../../../providers/model/Bus";
import {Line} from "../../../providers/model/Line";
import {Route} from "../../../providers/model/Route";
import {Stop} from "../../../providers/model/Stop";

import {Http} from "angular2/http";
/**
 * Created by sholzer on 06.05.2016.
 * Updated by skaldo on 07.05.2016.
 */

describe("CitizenDataService specifications", function () {
    //Mocks
    var restApi: RestApiProvider; ///*by sholzer: In unit tests we should not use other units*/= new RestApiProvider();
    var storageApi: PersistentDataProvider; //=  new PersistentDataProvider();

    //Reusable Data
    var storageUpdateData: UpdateData;
    var serverUpdateData: UpdateData;

    var http: any;

    var busses: Bus[];
    var lines: Line[];
    var stops: Stop[];
    var routes: Route[];

    /**
     * Creates an array of data of the type T
     * @param n length of the Array
     * @param type Class of the Type this array will contain
     * @return Array<T> with objects with id = 1...n
     */
    var createMockData = function <T>(n: number, type: { new (): T }): T[] {
        var result: T[] = [];
        // und bist du nicht willig ... 
        for (var i: number = 0; i < n; i++) {
            var object = new type();
            object['id'] = i;
            result.push(<T>object);
        }

        return result;
    }

    beforeEach(() => { //Reset Stubs

        var storageUpdateData = new UpdateData();
        storageUpdateData.busses = 1;
        storageUpdateData.lines = 1;
        storageUpdateData.routes = 1;
        storageUpdateData.stops = 1;

        var serverUpdateData = new UpdateData();
        serverUpdateData.busses = 1;
        serverUpdateData.lines = 1;
        serverUpdateData.routes = 1;
        serverUpdateData.stops = 1;

        busses = createMockData<Bus>(10, Bus);
        lines = createMockData<Line>(10, Line);
        stops = createMockData<Stop>(10, Stop);
        routes = createMockData<Route>(10, Route);
    });

    // Test object
    var citizenDataService: CitizenDataServiceInterface;
    describe("Initialization", function () {

        storageApi = <PersistentDataProvider>{
            getLastUpdateTimes(): Promise<UpdateData> {
                var storageUpdateData = new UpdateData();
                storageUpdateData.busses = 1;
                storageUpdateData.lines = 1;
                storageUpdateData.routes = 1;
                storageUpdateData.stops = 1;
                var p: Promise<UpdateData> = Promise.resolve(storageUpdateData);
                debugger;
                return p;
            },
            getBusses(): Promise<Bus[]> {
                busses = createMockData<Bus>(10,Bus);
                return Promise.resolve(busses);
            },
            getLines(): Promise<Line[]> {
                return Promise.resolve(lines);
            },
            getRoutes(): Promise<Route[]> {
                return Promise.resolve(routes);
            },
            getStops(): Promise<Stop[]> {
                return Promise.resolve(stops);
            }
        };

        citizenDataService = new CitizenDataService(restApi, storageApi);
        var cache: CitizenDataCache = (<CitizenDataService>citizenDataService).getCache();
        it("Fetching busses", () => {
            assertEqualJson(cache.cached_busses, busses);
        });
        /*
        //Expects
        it("Call for busses", function () {
            expect(storageApi.getBusses).toHaveBeenCalled;
        })
        it("Call for lines", function () {
            expect(storageApi.getLines).toHaveBeenCalled;
        })
        it("Call for stops", function () {
            expect(storageApi.getStops).toHaveBeenCalled;
        })
        it("Call for routes", function () {
            expect(storageApi.getRoutes).toHaveBeenCalled;
        })
        it("Call for last update time", function () {
            expect(storageApi.getLastUpdateTimes).toHaveBeenCalled;
        })*/
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
    if (JSON.stringify(input) != JSON.stringify(expectation)) fail("Expected\n" + JSON.stringify(input) + "\nto be equal to\n" + JSON.stringify(expectation));

}