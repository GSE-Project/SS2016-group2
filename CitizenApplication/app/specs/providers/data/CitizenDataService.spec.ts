import {RestApiProvider} from "../../../providers/data/RestApiProvider";
import {PersistentDataProvider} from "../../../providers/data/PersistentDataProvider";
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