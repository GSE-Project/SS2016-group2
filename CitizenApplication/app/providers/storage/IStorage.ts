/**
 * @author sholzer 160601
 */
import {Injectable} from '@angular/core';

export default IStorage

/**
 * Interface for an injectable Storage object
 */
@Injectable()
export abstract class IStorage {

    /**
     * returns the data set as asynchronous string
     * @param key of the data set
     * @return Promise<string> after completion
     */
    abstract get(key: string): Promise<string>;
    
    /**
     * returns the data set as asynchronous json object
     * @param key of the data set
     * @return Promise<any> after completion
     */
    abstract getJson(key: string): Promise<any>;
    /**
     * saves the value with the key
     * @param key data key
     * @param value data set
     * @return Promise<any> resolved after completion
     */
    abstract set(key: string, value: any): Promise<any>;
    /**
     * saves the value with the key
     * @param key data key
     * @param value data set
     * @return Promise<any> resolved after completion
     */
    abstract setJson(key: string, value: any): Promise<any>;
    abstract clear(): Promise<any>;
    /**
     * Removes the data set associated with the key from the storage
     * @param key string
     * @returns Promise<any> resolves after completion
     */
    abstract remove(key: string): Promise<any>;
    abstract query(query: string, params?: any): Promise<any>;

}