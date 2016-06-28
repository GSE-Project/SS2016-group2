/**
 * @author sholzer 160601
 */
import {IStorage} from './IStorage';
import {ConfigurationService} from '../config';
import {Logger, LoggerFactory} from '../logger';
import {Storage, LocalStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';

export default InjectableLocalStorage;

/**
 * Injectable wrapper for ionic-angular LocalStorage. All methods are delegates for LocalStorage
 */
@Injectable()
export class InjectableLocalStorage implements IStorage {

    private storage: Storage;
    private logger: Logger;

    constructor(config: ConfigurationService) {
        this.storage = new Storage(LocalStorage);
        this.logger = new LoggerFactory().getLogger(config.misc.log_level, 'LocalStorageWrapper', config.misc.log_pretty_print);
        this.logger.info('Using LocalStorage');
    }


    get(key: string): Promise<string> {
        return this.storage.get(key);
    }

    getJson(key: string): Promise<any> {
        return this.storage.getJson(key);
    }

    set(key: string, value: any): Promise<any> {
        return this.storage.set(key, value);
    }

    setJson(key: string, value: any): Promise<any> {
        return this.storage.set(key, value);
    }

    clear(): Promise<any> {
        return this.storage.clear();
    }

    remove(key: string): Promise<any> {
        return this.storage.remove(key);
    }

    query(query: string, params?: any): Promise<any> {
        return this.storage.query(query, params);
    }

}