/**
 * ViewSchedule
 * Author: skaldo, 05.06.2016
 */

import * as moment from 'moment/moment';

export class ViewSchedule {
  public lineName: string;
  public lineId: number;
  public stopId: number;
  public arrivingTime: moment.Moment;
};