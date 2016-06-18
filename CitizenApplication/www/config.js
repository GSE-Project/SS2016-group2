/**
 * Configuration file of the CitizenApplication
 * Created by skaldo on 22.05.2016
 * Base TypeScript implementation by sholzer on 22.05.2016
 */

window.citizenConfig = {
    rest_api: {
        host_url: 'http://gsepg1.skaldo.cz/services/rest',
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
        log_pretty_print: true,
    },
    version: {
        build_number: 'localBuild',
        commit: 'localBuild',
        release: undefined
    }
}