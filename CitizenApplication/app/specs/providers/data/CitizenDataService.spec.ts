import CitizenDataServiceInterface from "../../../providers/data/CitizenDataServiceInterface";
import {RestApiProviderInterface} from "../../../providers/data/RestApiProviderInterface";
import PersistentDataProviderInterface from "../../../providers/data/PersistentDataProviderInterface";
import {CitizenDataService} from "../../../providers/data/CitizenDataService";
import {UpdateData} from "../../../providers/model/UpdateData";
import Line from "../../../providers/model/Line";
import Route from "../../../providers/model/Route";
import Stop from "../../../providers/model/Stop";
import before = testing.before;
/**
 * Created by sholzer on 06.05.2016.
 */

describe("CitizenDataService specifications", function(){

    //Mocks
    var restApi : RestApiProviderInterface = jasmine.createSpyObj('restApi', [
        'getUpdateDataFromServer',
        'getBussesFromServer',
        'getLinesFromServer',
        'getStopsFromServer',
        'getRoutesFromServer',
        'getRealTimeBusData'
    ]);
    var storageApi : PersistentDataProviderInterface = jasmine.createSpyObj('storageApi',[
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

    before(function(){ //Reset Stubs
        spyOn(restApi, 'getUpdateDataFromServer').and.stub();
        spyOn(restApi, 'getBussesFromServer').and.stub();
        spyOn(restApi, 'getLinesFromServer').and.stub();
        spyOn(restApi, 'getStopsFromServer').and.stub();
        spyOn(restApi, 'getRoutesFromServer').and.stub();
        spyOn(restApi, 'getRealTimeBusData').and.stub();
        spyOn(storageApi, 'getLastUpdateTimes').and.stub();
        spyOn(storageApi, 'putLastUpdateTimes').and.stub();
        spyOn(storageApi, 'getBusses').and.stub();
        spyOn(storageApi, 'getLines').and.stub();
        spyOn(storageApi, 'getRoutes').and.stub();
        spyOn(storageApi, 'getStops').and.stub();
        spyOn(storageApi, 'putBusses').and.stub();
        spyOn(storageApi, 'putLines').and.stub();
        spyOn(storageApi, 'putStops').and.stub();
        spyOn(storageApi, 'putRoutes').and.stub();
});

    // Test object
    var citizenDataService : CitizenDataServiceInterface = new CitizenDataService(restApi, storageApi);
    it("Initialization and Update", function(){
        var storageUpdateData = new UpdateData();
        storageUpdateData.busses = 1;
        storageUpdateData.lines = 1;
        storageUpdateData.routes = 1;
        storageUpdateData.stops = 1;
        var serverUpdateData = new UpdateData();
        serverUpdateData.busses = 1;
        serverUpdateData.lines = 2;
        serverUpdateData.routes = 1;
        serverUpdateData.stops = 1;
        var serverLines :Line[] = [new Line(),new Line()];
        spyOn(storageApi, 'getLastUpdateTimes').and.returnValue(storageUpdateData);
        spyOn(restApi, 'getUpdateDataFromServer').and.returnValue(serverUpdateData);
        spyOn(restApi, 'getLinesFromServer').and.returnValue(serverLines);
        spyOn(restApi, 'getBussesFromServer');
        expect(storageApi.getLastUpdateTimes).toHaveBeenCalled();
        expect(restApi.getUpdateDataFromServer).toHaveBeenCalled();
        expect(restApi.getBussesFromServer).not.toHaveBeenCalled();
        expect(restApi.getLinesFromServer).toHaveBeenCalled();
        expect(storageApi.putLines).toHaveBeenCalled();
        expect(storageApi.putLines).toHaveBeenCalledWith(serverLines);
    });



});
