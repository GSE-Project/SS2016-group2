/**
 * Created by steff on 13.05.2016.
 * Reviewed by skaldo on 13.05.2016
 * Reviewed and updated by skaldo on 22.05.2016
 */

export interface ICitizenDataObject {
    id: number;
}

export enum CitizenDataObjects {
    Bus,
    Line,
    RealTimeData,
    Route,
    Stop,
    UpdateData
}