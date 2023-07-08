import dayjs from 'dayjs';

enum MONTH {
  JANUARY = 0,
  FEBRUARY = 1,
  MARCH = 2,
  APRIL = 3,
  MAY = 4,
  JUNE = 5,
  JULY = 6,
  AUGUST = 7,
  SEPTEMBER = 8,
  OCTOBER = 9,
  NOVEMBER = 10,
  DECEMBER = 11,
};

enum WEEKDAY {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

interface BankHoliday {
  name: string;
  check(dayOfMonth: number, month: number, dayOfWeek: number): boolean;
}

const BANK_HOLIDAYS: BankHoliday[] = [{
  name: 'New Years Day',
  // January 1st
  check: (dayOfMonth, month) => month === MONTH.JANUARY && dayOfMonth === 1,
}, {
  name: 'Martin Luther King Jr. Day',
  // Third Monday in January
  check: (dayOfMonth, month, dayOfWeek) => month === MONTH.JANUARY && dayOfWeek === WEEKDAY.MONDAY && dayOfMonth >= 15 && dayOfMonth <= 21,
}, {
  name: 'Presidents Day',
  // Third Monday in February
  check: (dayOfMonth, month, dayOfWeek) => month === MONTH.FEBRUARY && dayOfWeek === WEEKDAY.MONDAY && dayOfMonth >= 15 && dayOfMonth <= 21,
}, {
  name: 'Memorial Day',
  // Last Monday of May
  check: (dayOfMonth, month, dayOfWeek) => month === MONTH.MAY && dayOfWeek === WEEKDAY.MONDAY && dayOfMonth >= 25,
}, {
  name: 'Juneteenth',
  // June 19th
  check: (dayOfMonth, month) => month === MONTH.JUNE && dayOfMonth === 19,
}, {
  name: 'Independence Day',
  // July 4th
  check: (dayOfMonth, month) => month === MONTH.JULY && dayOfMonth === 4,
}, {
  name: 'Labor Day',
  // First Monday in September
  check: (dayOfMonth, month, dayOfWeek) => month === MONTH.SEPTEMBER && dayOfWeek === WEEKDAY.MONDAY && dayOfMonth <= 7,
}, {
  name: 'Columbus Day',
  // Second Monday in October
  check: (dayOfMonth, month, dayOfWeek) => month === MONTH.OCTOBER && dayOfWeek === WEEKDAY.MONDAY && dayOfMonth >= 8 && dayOfMonth <= 14,
}, {
  name: 'Veterans Day',
  // November 11th
  check: (dayOfMonth, month) => month === MONTH.NOVEMBER && dayOfMonth === 11,
}, {
  name: 'Thanksgiving Day',
  // Fourth Thursday in November
  check: (dayOfMonth, month, dayOfWeek) => month === MONTH.NOVEMBER && dayOfWeek === WEEKDAY.THURSDAY && dayOfMonth >= 22 && dayOfMonth <= 28,
}, {
  name: 'Christmas Day',
  // December 25th
  check: (dayOfMonth, month) => month === MONTH.DECEMBER && dayOfMonth === 25,
}];

export const isBankHoliday = (date: dayjs.Dayjs) => {
  const dayOfWeek = date.day();
  // Saturday or Sunday
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    return true;
  }
  const month = date.month();
  const dayOfMonth = date.date();
  return BANK_HOLIDAYS.some((bankHoliday) => bankHoliday.check(dayOfMonth, month, dayOfWeek));
};
