/**
 * @author sholzer at 160521
 */

export default CitizenApplicationConfig;

export const RESTAPI_FIELD: string = 'rest_api';
export const STORAGEAPI_FIELD: string = 'storage_api';
export const MISC_FIELD: string = 'misc';
export const VERSION_FIELD = 'version';

/**
 * JSON parsable interface for the CitizenApplication configuration
 */
export interface CitizenApplicationConfig {
    /**
     * Configuration of the RestApi
     */
    rest_api: RestApiConfig;
    /**
     * Configuration of the StorageApi
     */
    storage_api: StorageApiConfig;
    /**
     * Other non-data related configuration
     */
    misc: MiscellaneousConfig;
    /**
     * The version related information
     */
    version: VersionConfig;
}

/**
 * Common base interface for RestApiConfig and StorageApiConfig
 */
export interface AccessConfig {
    busses: string;
    lines: string;
    routes: string;
    stops: string;
}

/**
 * Configuration of the RestApi. The {AccessConfig} properties are used as URL suffixes (see {RestApiConfig#update})
 */
export interface RestApiConfig extends AccessConfig {
    /**
     * The URL of the backend server
     */
    host_url: string;
    /**
     * The url suffix to fetch the update data from the backend. i.e. host_url/update is called to fetch update data
     */
    update: string;
    /**
     * The url suffix to fetch the real time bus data from the backend. {host_url}/{rt_data}{id} is called to fetch the update data where id refers to the bus id
     */
    rt_data: string;
}

/**
 * Configuration of the StorageApi. The {AccessConfig} properties are used as keys
 */
export interface StorageApiConfig extends AccessConfig {
    // Room for additional storage configuration like storage types or so. 
}

/**
 * non-data related configuration
 */
export interface MiscellaneousConfig {
    /**
     * The application's language.
     */
    language: string;

    /**
     * The deepest log level to be displayed
     * Possible Value are : debug, info, warn, error
     */
    log_level: string;

    /**
     * Specifies if the log should be pretty and colofull or basic and PhantomJS compatible
     */
    log_pretty_print: boolean;
    
    app_version: string;
}

export interface VersionConfig {
    /**
     * The Travis build number
     */
    build_number: string;
    /**
     * The commit that triggered the build
     */
    commit: string;
    /**
     * Defines if the app is release or debug
     */
    release: boolean;
}
