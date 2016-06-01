/**
 * @author sholzer 160601
 */

export default IStorage

/**
 * Interface for an injectable Storage object
 */
export interface IStorage{
    
    get(key:string):Promise<string>;
    getJson(key:string):Promise<any>;
    set(key:string, value:any):Promise<any>;
    setJson(key:string, value:any):Promise<any>;
    clear():Promise<any>;
    remove(key:string):Promise<any>;
    query(query:string, params?:any):Promise<any>;
   
}