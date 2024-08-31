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

  static FIRST_DAY_OF_YEAR = new Date(new Date().getFullYear(), 0, 1)
  static LAST_DAY_OF_YEAR = new Date(new Date().getFullYear(), 11, 31)
  static ONE_DAY_AFTER_NOW = new Date(Date.now() + 1000 * 60 * 60 * 24)
}
