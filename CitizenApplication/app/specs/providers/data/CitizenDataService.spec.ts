import CitizenDataServiceInterface from "../../../providers/data/CitizenDataServiceInterface";
import {RestApiProvider} from "../../../providers/data/RestApiProvider";
import {PersistentDataProvider} from "../../../providers/data/PersistentDataProvider";
import {CitizenDataService} from "../../../providers/data/CitizenDataService";
import {UpdateData} from "../../../providers/model/UpdateData";
import {Bus} from "../../../providers/model/Bus";
import {Line} from "../../../providers/model/Line";
import {Route} from "../../../providers/model/Route";
import {Stop} from "../../../providers/model/Stop";
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

    var busses: Bus[];
    var lines: Line[];
    var stops: Stop[];
    var routes: Route[];

    var createMockData = function <T>(n: number, type:{new():T}): T[] {
        var result: T[] = [];
        // und bist du nicht willig ... 
        for(var i:number = 0; i<n;i++){
            var object = new type();
            object['id']=i;
            result.push(<T>object);
        }
        
        return result;
    }

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

        busses = createMockData<Bus>(10, Bus);
        lines = createMockData<Line>(10, Line);
        stops = createMockData<Stop>(10, Stop);
        routes = createMockData<Route>(10, Route);

        (<jasmine.Spy>storageApi.getLastUpdateTimes).and.returnValue(storageUpdateData);
        (<jasmine.Spy>storageApi.getBusses).and.returnValue(busses);
        (<jasmine.Spy>storageApi.getLines).and.returnValue(lines);
        (<jasmine.Spy>storageApi.getRoutes).and.returnValue(routes);
        (<jasmine.Spy>storageApi.getStops).and.returnValue(stops);
    });

    // Test object
    var citizenDataService: CitizenDataServiceInterface;
    describe("Initialization", function () {


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

    describe("Update call", function () {

        //Setup
        var serverBusses = createMockData<Bus>(9, Bus);
        serverUpdateData = new UpdateData();
        serverUpdateData.busses = 2;
        serverUpdateData.lines = 1;
        serverUpdateData.routes = 1;
        serverUpdateData.stops = 1;

        beforeEach(() => {
            (<jasmine.Spy>restApi.getUpdateDataFromServer).and.returnValue(serverUpdateData);
            (<jasmine.Spy>restApi.getBussesFromServer).and.returnValue(serverBusses);
        });

        citizenDataService = new CitizenDataService(restApi, storageApi);
        citizenDataService.update();

        it("Timestamps from server fetched", function () {
            expect(restApi.getUpdateDataFromServer).toHaveBeenCalled;
        });
        it("Updated Bus data fetched", function () {
            expect(restApi.getBussesFromServer).toHaveBeenCalled;
        })
        it("Other entries are not updated", function () {
            expect(restApi.getLinesFromServer).not.toHaveBeenCalled;
            expect(restApi.getRoutesFromServer).not.toHaveBeenCalled;
            expect(restApi.getStopsFromServer).not.toHaveBeenCalled;
        });
        it("Stored updated timestamps in storage", function () {
            expect(storageApi.putLastUpdateTimes).toHaveBeenCalledWith(serverUpdateData);
        })
        it("Stored updated busses data in storage", function () {
            expect(storageApi.putBusses).toHaveBeenCalledWith(serverBusses);
            /*expect(storageApi.putLines).toHaveBeenCalledWith(lines);
            expect(storageApi.putRoutes).toHaveBeenCalledWith(routes);
            expect(storageApi.putStops).toHaveBeenCalledWith(stops);*///Depends on exact implementation
        });
    });

    describe("Getter", function () {
        // Depends on current (2016-05-08, 16:47) implementation of createMockData()
        var resultBusses: Bus[];

        citizenDataService = new CitizenDataService(restApi, storageApi);
        it("Get all busses", function () {
            resultBusses = citizenDataService.getBusList();
            resultBusses.forEach((b, i) => {
                if (busses.indexOf(b) == -1) {
                    fail("Returned list is incomplete");
                }
            });
        });
        it("Get one bus", function () {
            var inputBusses: Bus[] = [new Bus(), new Bus()];
            (<jasmine.Spy>storageApi.getBusses).and.returnValue(inputBusses);
            var filterBus: Bus;
            filterBus = new Bus();
            filterBus.id = 2;
            if (typeof (filterBus) == "undefined") fail("Input Bus is undefined");
            resultBusses = citizenDataService.getBusList(filterBus);
            if (resultBusses.length != 1) fail("Array has the wrong size");
            if (typeof (resultBusses[0]) == "undefined") fail("No Bus returned. Type was " + typeof (resultBusses[0]));
            if (resultBusses[0].id != 2) fail("Wrong Bus object returned");
        });
    });

});
