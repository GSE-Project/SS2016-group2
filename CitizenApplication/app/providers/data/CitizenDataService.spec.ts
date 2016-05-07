import CitizenDataServiceInterface from "./CitizenDataServiceInterface";
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import PersistentDataProviderInterface from "./PersistentDataProviderInterface";
import {CitizenDataService} from "./CitizenDataService";
import {UpdateData} from "../model/UpdateData";
import Bus from "../model/Bus";
import Line from "../model/Line";
import Route from "../model/Route";
import Stop from "../model/Stop";
/**
 * Created by sholzer on 06.05.2016.
 */

describe("CitizenDataService specifications", function () {

    //Mocks
    var restApi: RestApiProviderInterface;
    var storageApi: PersistentDataProviderInterface;
    
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
        
        storageApi= jasmine.createSpyObj('storageApi', [
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
    var citizenDataService: CitizenDataServiceInterface = new CitizenDataService(restApi, storageApi);
    describe("Initialization", function () {
        
        var busses = [new Bus()];
        var lines = [new Line()];
        var stops = [new Stop()];
        var routes = [new Route()];
        
        //Spy setup
       spyOn(storageApi, 'getLastUpdateTimes').and.returnValue(storageUpdateData);
       spyOn(storageApi, 'getBusses').and.returnValue(busses);
       spyOn(storageApi, 'getLines').and.returnValue(lines);
       spyOn(storageApi, 'getRoutes').and.returnValue(routes);
       spyOn(storageApi, 'getStops').and.returnValue(stops);
       
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
