import CitizenDataServiceInterface from "../../../providers/data/CitizenDataServiceInterface";
/**
 * Created by sholzer on 06.05.2016.
 */

describe("CitizenDataService specifications", function(){

    var citizenDataService : CitizenDataService = new CitizenDataService;

    it("Initialization of the CitizenDataService object", function(){
        spyOn(citizenDataService, 'update');
        expect(citizenDataService.update).toHaveBeenCalled();
    })



});
