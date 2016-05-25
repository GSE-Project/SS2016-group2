/**
 * @author sholzer 160524
 */
import {ConfigurationService} from '../config/ConfigurationService';
import {Injectable} from '@angular/core';

export default LoggerFactory;

const DEBUG_STRING = 'debug';
const INFO_STRING = 'info';
const WARN_STRING = 'warn';
const ERROR_STRING = 'error';

@Injectable()
export class LoggerFactory {

    constructor(private config: ConfigurationService) {

    }

    getLogger(identifier: string): Logger {
        return new Logger(this.config.misc.log_level, identifier, this.config.misc.log_pretty_print);
    }

}


/**
 * Logger class to log things in the application. This isn't an injectable service
 */
export class Logger {
    private _identifier: string = '';
    private _logLevel: LogLevel;
    private _pretty_print: boolean;

    /**
     * DO NOT USE
     */
    constructor(log_lvl: string, identifier: string, pretty_print: boolean) {
        this._identifier = identifier;
        this._logLevel = this.stringToLogLevel(log_lvl);
    }

    debug(msg: string): void {
        this.log(msg, 'color: #04B404', LogLevel.DEBUG);
    }

    info(msg: string): void {
        this.log(msg, 'color: #000000', LogLevel.INFO);
    }

    warn(msg: string): void {
        this.log(msg, 'color: #D7DF01', LogLevel.WARN);
    }

    error(msg: string): void {
        this.log(msg, 'color: #DF0101', LogLevel.ERROR);
    }

    private log(msg: string, color_css: string, lvl: LogLevel) {
        if (this._logLevel.valueOf() <= lvl.valueOf()) {
            let lvl_string: string = this.logLevelToString(lvl);
            if (this._pretty_print) {
                console.log('%c[%s]@%s: %s', color_css, lvl_string, this._identifier, msg);
            } else {
                console.log('[' + lvl_string + ']@' + this._identifier + ': ' + msg);
            }
        }
    }

    /**
     * Parses the log level string to an enum
     * @param lvl string
     * @returns LogLevel according to the log level string. Fallback is DEBUG
     */
    private stringToLogLevel(lvl: string): LogLevel {
        switch (lvl) {
            default:
            case DEBUG_STRING: return LogLevel.DEBUG;
            case INFO_STRING: return LogLevel.INFO;
            case WARN_STRING: return LogLevel.WARN;
            case ERROR_STRING: return LogLevel.ERROR;
        }
    }

    private logLevelToString(lvl: LogLevel): string {
        switch (lvl) {
            case LogLevel.DEBUG: return DEBUG_STRING;
            case LogLevel.INFO: return INFO_STRING;
            case LogLevel.WARN: return WARN_STRING;
            case LogLevel.ERROR: return ERROR_STRING;
        }
    }
}





enum LogLevel {

    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3

}
