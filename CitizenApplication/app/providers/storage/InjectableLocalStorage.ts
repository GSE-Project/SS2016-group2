/**
 * @author sholzer 160601
 */
import {IStorage} from './IStorage';
import {Storage, LocalStorage} from 'ionic-angular';

export default InjectableLocalStorage;

/**
 * Injectable wrapper for ionic-angular LocalStorage. All methods are delegates for LocalStorage
 */
export class InjectableLocalStorage implements IStorage {

    private storage: Storage;

    constructor() {
        this.storage = new Storage(LocalStorage);
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