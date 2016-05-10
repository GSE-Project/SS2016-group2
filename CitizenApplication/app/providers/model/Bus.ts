/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */

export default Bus;

export class Bus {
    public id: number;
    public numberPlate: string;
    public color: string;
    public pictureLink: string;

    fromJSON(json: any) {
        for (var propName in this) {
            if (json[propName]) {
                this[propName] = json[propName];
            }
        }
    }
}