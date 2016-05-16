/**
 * @author sholzer 160516
 */

import {PersistentDataProvider} from '../../../providers/data/PersistentDataProvider';
import {IRestStops} from '../../../providers/model/rest/RestStops';
import {Storage} from 'ionic-angular';

import {Assert} from '../../util';

describe('PersistentDataProvider specifications', () => {

    var storage: Storage;
    var storageApi: PersistentDataProvider;

    it('Get Stops', () => {
        var stops: IRestStops = {
            timestamp: 1,
            stops: []
        };
        storage = <Storage>{

            get(key: string): Promise<string> {
                return Promise.resolve(JSON.stringify(stops));
            }

        };


        storageApi = new PersistentDataProvider();
        storageApi.setStorage(storage);
        storageApi.getStops().subscribe(data => {
            Assert.equalJson(data, stops);
        });
    });



});