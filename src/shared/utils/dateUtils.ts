export class DateUtils {
  public static getToday(): Date {
    return new Date()
  }

  public static parseStringDateToISO(date: Date | string): string {
    if (typeof date === 'string') {
      return date.split('T')[0]
    }

    return date.toISOString().split('T')[0]
  }
}
