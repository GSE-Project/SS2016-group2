/**
 * Configuration file of the CitizenApplication
 * Created by skaldo on 22.05.2016
 * Base TypeScript implementation by sholzer on 22.05.2016
 * Edit by skaldo on the 18.06.2016 - changed the url to newer version of the server.
 */

window.citizenConfig = {
    rest_api: {
        host_url: 'http://gsepg1v2.skaldo.cz/services/rest',
        busses: 'linemanagement/v1/busses',
        lines: 'linemanagement/v1/lines',
        routes: 'linemanagement/v1/routes',
        rt_data: 'linemanagement/v1/busses/',
        stops: 'linemanagement/v1/stops',
        update: 'linemanagement/v1/update'
    },
    storage_api: {
        busses: 'B',
        lines: 'L',
        routes: 'R',
        stops: 'S'
    },
    misc: {
        language: 'de',
        log_level: 'debug',
        log_pretty_print: true
    }
}