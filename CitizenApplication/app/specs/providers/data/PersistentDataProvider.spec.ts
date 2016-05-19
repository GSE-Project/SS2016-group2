/**
 * @author sholzer 160516
 */

import {PersistentDataProvider} from '../../../providers/data/PersistentDataProvider';
import {IRestStops} from '../../../providers/model/rest/RestStops';
import {IRestBusses} from '../../../providers/model/rest/RestBusses';
import {IRestLines} from '../../../providers/model/rest/RestLines';
import {IRestRoutes} from '../../../providers/model/rest/RestRoutes';
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

    it('Put Stops', () => {
         var busses: IRestBusses = {
            timestamp: 1, busses: []
        };
        var stops: IRestStops = {
            timestamp: 4,
            stops: []
        };
        var lines: IRestLines = {
            timestamp: 2,
            lines: []
        };
        var routes: IRestRoutes = {
            timestamp: 3,
            routes: []
        };
        storage = <Storage>{

            get(key: string): Promise<string> {
                switch (key) {
                    case 'B':
                        return Promise.resolve(JSON.stringify(busses));
                    case 'L':
                        return Promise.resolve(JSON.stringify(lines));
                    case 'R':
                        return Promise.resolve(JSON.stringify(routes));
                    case 'S':
                        return Promise.resolve(JSON.stringify(stops));
                }
            },

            set(key: string, value: string): Promise<any> {
                return Promise.resolve(stops);
            }

        };

        var new_stops: IRestStops = {
            timestamp: 5,
            stops: []
        };

        storageApi = new PersistentDataProvider();
        storageApi.setStorage(storage);
        storageApi.putStops(new_stops);
        // DS - I'm not sure about this part if we need to test it.
        /*
        setTimeout(function () { // We need to ensure that all promises are resolved by waiting half a second
            Assert.equalJson(storageApi.getTimeStamps().stops, 5);
        }, 500);
        */
    });

    it('Get Timestamps', () => {
        var busses: IRestBusses = {
            timestamp: 1, busses: []
        };
        var stops: IRestStops = {
            timestamp: 4,
            stops: []
        };
        var lines: IRestLines = {
            timestamp: 2,
            lines: []
        };
        var routes: IRestRoutes = {
            timestamp: 3,
            routes: []
        };
        storage = <Storage>{

            get(key: string): Promise<string> {
                switch (key) {
                    case 'B':
                        return Promise.resolve(JSON.stringify(busses));
                    case 'L':
                        return Promise.resolve(JSON.stringify(lines));
                    case 'R':
                        return Promise.resolve(JSON.stringify(routes));
                    case 'S':
                        return Promise.resolve(JSON.stringify(stops));
                }
            }

        };


        storageApi = new PersistentDataProvider();
        storageApi.setStorage(storage);
        setTimeout(function () { // We need to ensure that all promises are resolved by waiting half a second
            // isReady is not needed anymore.
            // Assert.equalJson(storageApi.isReady(), true);
            /* DS - See L85
            Assert.equalJson(storageApi.getTimeStamps(), JSON.stringify({ busses: 1, lines: 2, routes: 3, stops: 4 }));
            */
        }, 500);
    });


});