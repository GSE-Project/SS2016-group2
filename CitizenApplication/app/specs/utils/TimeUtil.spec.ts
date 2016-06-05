/**
 * @author sholzer 1606051409
 */

import {TimeUtil} from '../../utils';
import * as utils from '../util';


describe('TimeUtil specification', () => {

    let [hours, minutes, seconds] = [11, 20, 30];
    let testData = hours + ':' + minutes + ':' + seconds;

    it('Get hours', (done) => {
        utils.Assert.equalJson(TimeUtil.getHours(testData), hours, 'Wrong hours retrieved');
        done();
    });
    it('Get minutes', (done) => {
        utils.Assert.equalJson(TimeUtil.getMinutes(testData), minutes, 'Wrong minutes retrieved');
        done();
    });
    it('Get seconds', (done) => {
        utils.Assert.equalJson(TimeUtil.getSeconds(testData), seconds, 'Wrong seconds retrieved');
        done();
    });
    it('Get TimeString', (done) => {
        let date = new Date(Date.now());
        date.setHours(hours, minutes, seconds);
        utils.Assert.equalJson(TimeUtil.getTimeString(date), testData, 'Wrong TimeString prpduced');
        done();
    });

});