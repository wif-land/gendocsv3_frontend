export class DateUtils {
  public static getToday(): Date {
    return new Date()
  }

  public static parseStringDateToISO(date: Date): string {
    return date.toISOString()
  }
}
