/**
 * Configuration file of the CitizenApplication
 * Created by skaldo on 22.05.2016
 * Base TypeScript implementation by sholzer on 22.05.2016
 */

window.citizenConfig = {
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