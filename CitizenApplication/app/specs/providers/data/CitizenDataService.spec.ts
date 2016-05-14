import {RestApiProvider} from "../../../providers/data/RestApiProvider";
import {PersistentDataProvider} from "../../../providers/data/PersistentDataProvider";
import {IUpdateData} from "../../../providers/model/UpdateData";
import {IBus} from "../../../providers/model/Bus";
import {ILine} from "../../../providers/model/Line";
import {IRoute} from "../../../providers/model/Route";
import {IStop} from "../../../providers/model/Stop";

import {Http} from "angular2/http";
import {IRestStops} from "../../../providers/model/rest/RestStops";
import {Observable} from "rxjs/Observable";
import {CitizenDataService} from "../../../providers/data/CitizenDataService";
/**
 * Created by sholzer on 06.05.2016.
 * Updated by skaldo on 07.05.2016.
 */

describe("CitizenDataService specifications", function () {
   
    var restApi : RestApiProvider = <RestApiProvider>{

        getUpdateData():Observable<IUpdateData>{
          return Observable.of({
              busses:1,lines:1,routes:1, stops:1
          });
        },
        getStops():Observable<IRestStops>{
            return Observable.of({timestamp:1, stops:[{id:1}]});
        }
    };
    var storageApi : PersistentDataProvider = <PersistentDataProvider>{

        getTimeStamps():IUpdateData{
            return{
                busses:0,lines:0,routes:0, stops:0
            };
        },
        getStops():Observable<IRestStops>{
            return Observable.of({timestamp:0, stops:[]});
        },
        putStops(data:IRestStops):void{
            //nothing
        }

    };

    var citizenDataService : CitizenDataService = new CitizenDataService(restApi, storageApi);

    it("Get ServerStops", ()=>{
        assertEqualJson(citizenDataService.getStops(), restApi.getStops());
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

/**
 * Tests if the JSON representation of two objects is  NOT equal (we don't need the exact reference but only an equal)
 * @author sholzer 160511 (I wanted an Junit equivalent of assertEquals())
 * @param input :any an object
 * @param expectation :any the object input is expected NOT to be equal
 * @return void. Calls fail() if JSON.stringify(input) == JSON.stringify(expectation)
 */
function assertNotEqualJson(input: any, expectation: any): void {
    if (JSON.stringify(input) == JSON.stringify(expectation)) fail("Expected\n" + JSON.stringify(input) + "\nNOT to be equal to\n" + JSON.stringify(expectation));

}