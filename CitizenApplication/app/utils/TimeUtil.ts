/**
 * @author sholzer 1606051307
 */

export default TimeUtil;

export class TimeUtil {

    /**
     * @param value string of the regular expression hh:mm:ss
     * @return hh as number (0-23)
     */
    static getHours(value: string): number {
        return this.getValue(value, 0, 2);
    }

    /**
     * @param value string of the regular expression hh:mm:ss
     * @return mm as number (0-59)
     */
    static getMinutes(value: string): number {
        return this.getValue(value, 3, 5);
    }

    /**
     * @param value string of the regular expression hh:mm:ss
     * @return ss as number (0-59)
     */
    static getSeconds(value: string): number {
        return this.getValue(value, 6, 8);
    }

    /**
     * @param Date
     * @return 'hh:mm:ss'
     */
    static getTimeString(value: Date): string {
        return value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds();
    }


    private static getValue(value: string, startInc: number, endExc: number): number {
        let subString: string = value.substring(startInc, endExc);
        return Number(subString);
    }
}