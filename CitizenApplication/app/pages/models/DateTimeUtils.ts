/**
 * Provides several methods to transfer data from the ionic framework to plain old typescript
 * @author sholzer
 */
export class DateTimeUtil {

    /** 
     * @static
     * @param {string} time of the regex 'HH:mm'
     * @returns {Date} from today with the specified hours and minutes
    */
    static ionicHourMinuteString2Date(time: string): Date {
        let regex = new RegExp('..:..');
        let date = new Date();
        if (regex.test(time)) {
            let time_split: string[] = time.split(':');
            date.setHours(Number(time_split[0]), Number(time_split[1]));
        }
        return date;
    }

    /** 
     * @static
     * @param {Date} date a javascript Date object
     * @returns {string} string of the form 'HH:mm'
    */
    static dateToIonicHourMinuteString(date: Date): string {
        let result = '';
        let hours: number = date.getHours();
        let minutes: number = date.getMinutes();
        if (hours < 10) {
            result = result + '0';
        }
        result = result + hours + ':';
        if (minutes < 10) {
            result = result + '0';
        }
        result = result + minutes;
        console.log(result);
        return result;
    }
}