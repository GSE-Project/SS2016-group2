import {CitizenDataService} from '../../../providers/data';
import {TransformationService} from '../../../providers/transformation';

import * as VIEW from '../../../pages/models';
import {Observable} from 'rxjs/Rx';
import * as DATA from '../../../providers/model';

import {Assert} from '../../util';


describe('TransformationService specification', () => {

    describe('proof of work', () => {

        let restStops = <DATA.IRestStops>{
            stops: [
                {
                    id: 1,
                    name: 'firstStop',
                    schedule: [{
                        lineName: 'firstLine',
                        lineId: 1,
                        stopId: 1,
                        arrivingTime: '11:00',
                    }, {
                            lineName: 'firstLine',
                            lineId: 1,
                            stopId: 1,
                            arrivingTime: '12:00'
                        }],
                    location: { type: 'Point', coordinates: [1, 1] },
                    lines: [{ id: 1 }]
                }, {
                    id: 2,
                    name: 'secondStop',
                    schedule: [{
                        lineName: 'firstLine',
                        lineId: 1,
                        stopId: 2,
                        arrivingTime: '11:00',
                    }, {
                            lineName: 'secondLine',
                            lineId: 2,
                            stopId: 2,
                            arrivingTime: '12:00'
                        }],
                    location: { type: 'Point', coordinates: [1, 1] },
                    lines: [{ id: 1 }, { id: 2 }]
                }
            ],
            timeStamp: 1
        };

        let cds = <CitizenDataService>{
            getStops(): Observable<DATA.IStop[]> {
                return Observable.of(restStops.stops);
            }
        };

        let transformationService = new TransformationService(cds);
        it('Testing transformation', (done) => {
            transformationService.getStops().subscribe((result) => {
                Assert.equalJson(result.length, 2, 'Wrong array size');
                let firstStop: VIEW.ViewStop = result[0];
                Assert.equalJson(firstStop.name, restStops.stops[0].name);
                Assert.equalJson(firstStop.schedule.length, 2, 'Wrong number of scheduled stops');
                done();
            });
        });
        describe('Testing filer', () => {
            let filterData: VIEW.ViewStop[] = [new VIEW.ViewStop(restStops.stops[0]), new VIEW.ViewStop(restStops.stops[1])];

            it('No Filter', (done) => {
                let noFilter = filterData.filter(transformationService.getFilter());
                Assert.equalJson(noFilter.length, 2);
                done();
            });
            it('Filter for first element', (done) => {
                let firstFilter = filterData.filter(transformationService.getFilter('first'));
                Assert.equalJson(firstFilter.length, 1);
                done();
            });
            it('Filter for second element', (done) => {
                let secondFilter = filterData.filter(transformationService.getFilter('second'));
                Assert.equalJson(secondFilter.length, 1);
                done();
            });
            it('Filter to empty', (done) => {
                let emptyFilter = filterData.filter(transformationService.getFilter('ladsf'));
                Assert.equalJson(emptyFilter.length, 0);
                done();
            });
            it('Filter for inner match', (done) => {
                let innerFilter = filterData.filter(transformationService.getFilter('stSt'));
                Assert.equalJson(innerFilter.length, 1);
                done();
            });
            it('Case insensitive filter', (done) => {
                let caseInsensitiveFilter = filterData.filter(transformationService.getFilter('ndst'));
                Assert.equalJson(caseInsensitiveFilter.length, 1);
                done();
            });
        });

        it('Testing filtered transformation', (done) => {
            transformationService.getStops('first').subscribe((data => {
                Assert.equalJson(data.length, 1);
                done();
            }));

        });
    });


});