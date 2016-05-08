import CitizenDataServiceInterface from "./CitizenDataServiceInterface";
import {RestApiProvider} from "./RestApiProvider";
import {PersistentDataProvider} from "./PersistentDataProvider";
import {CitizenDataService} from "./CitizenDataService";
import {UpdateData} from "../model/UpdateData";
import Bus from "../model/Bus";
import Line from "../model/Line";
import Route from "../model/Route";
import Stop from "../model/Stop";
/**
 * Created by sholzer on 06.05.2016.
 * Updated by skaldo on 07.05.2016.
 */

describe("CitizenDataService specifications", function () {
    //Mocks
    var restApi: RestApiProvider ///*by sholzer: In unit tests we should not use other units*/= new RestApiProvider();
    var storageApi: PersistentDataProvider //=  new PersistentDataProvider();

    //Reusable Data
    var storageUpdateData: UpdateData;
    var serverUpdateData: UpdateData;


    beforeEach(function () { //Reset Stubs
        restApi = jasmine.createSpyObj('restApi', [
            'getUpdateDataFromServer',
            'getBussesFromServer',
            'getLinesFromServer',
            'getStopsFromServer',
            'getRoutesFromServer',
            'getRealTimeBusData'
        ]);

        storageApi = jasmine.createSpyObj('storageApi', [
            'getLastUpdateTimes',
            'putLastUpdateTimes',
            'getBusses',
            'putBusses',
            'getLines',
            'putLines',
            'getStops',
            'putStops',
            'getRoutes',
            'putRoutes'
        ]);

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
    });

    // Test object
    var citizenDataService: CitizenDataServiceInterface;
    describe("Initialization", function () {

        var createMockData = function <T>(n: number): T[] {
            var result: T[] = new Array<T>(n);
            result.forEach((v, i) => {
                v['id'] = i;
            })
            return result;
        }

        var busses = createMockData<Bus>(10);
        var lines = createMockData<Line>(10);
        var stops = createMockData<Stop>(10);
        var routes = createMockData<Route>(10);

        beforeEach(()=>{
            //Spy setup
            (<jasmine.Spy> storageApi.getLastUpdateTimes).and.returnValue(storageUpdateData);
            (<jasmine.Spy> storageApi.getBusses).and.returnValue(busses);
            (<jasmine.Spy> storageApi.getLines).and.returnValue(lines);
            (<jasmine.Spy> storageApi.getRoutes).and.returnValue(routes);
            (<jasmine.Spy> storageApi.getStops).and.returnValue(stops);
            
        });

        citizenDataService = new CitizenDataService(restApi, storageApi);

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
        })
    });



});
