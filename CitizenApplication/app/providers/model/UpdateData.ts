/**
 * Created by sholzer on 03.05.2016.
 * Reviewed by skaldo on 06.05.2016.
 */

export class UpdateData {
    public busses: number;
    public lines: number;
    public routes: number;
    public stops: number;

    fromJSON(json: any) {
        for (var propName in this) {
            if (json[propName]) {
                this[propName] = json[propName];
            }
        }
    }
}