/**
 * @author sholzer 160522
 */
import {CitizenApplicationConfig} from './CitizenApplicationConfig';

export const CURRENT_CONFIG : CitizenApplicationConfig = {
    rest_api: {
        host_url: 'http://localhost:3000',
        busses: 'busses',
        lines: 'lines',
        routes: 'routes',
        rt_data: 'busses/',
        stops: 'stops',
        update: 'update'
    },
    storage_api: {
        busses: 'B',
        lines: 'L',
        routes: 'R',
        stops: 'S'
    },
    misc: {
        language: 'de'
    }
} 