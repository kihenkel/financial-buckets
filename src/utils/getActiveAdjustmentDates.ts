import { Account, RecurringAdjustment } from '@/models';
import dayjs from 'dayjs';
import { calculateOccurences } from './calculateOccurences';

const getCurrentPeriod = (account: Account): { start: dayjs.Dayjs, end: dayjs.Dayjs } => {
  const now = dayjs();
  if (account.cycle === 'weekly') {
    return {
      start: now.day(0).hour(0).minute(0).second(0).millisecond(0),
      end: now.add(1, 'week').day(0).hour(0).minute(0).second(0).millisecond(0),
    }
  } else if (account.cycle === 'biweekly') {
    const isFirstWeek = now.week() % 2 === 1;
    return {
      start: isFirstWeek ? now.day(0).hour(0).minute(0).second(0).millisecond(0) : now.subtract(1, 'week').day(0).hour(0).minute(0).second(0).millisecond(0),
      end: isFirstWeek ?
        now.add(2, 'week').day(0).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'second') :
        now.add(1, 'week').day(0).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'second'),
    }
  } else if (account.cycle === 'semimonthly') {
    const isFirstHalf = now.date() < 15;
    return {
      start: isFirstHalf ? now.date(1).hour(0).minute(0).second(0).millisecond(0) : now.date(15).hour(0).minute(0).second(0).millisecond(0),
      end: isFirstHalf ?
        now.date(15).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'second') :
        now.add(1, 'month').date(1).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'second'),
    }
  } else if (account.cycle === 'monthly') {
    return {
      start: now.date(1).hour(0).minute(0).second(0).millisecond(0),
      end: now.add(1, 'month').date(1).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'second'),
    }
  }
  throw new Error(`Account cycle ${account.cycle} not supported`);
};

export const getActiveAdjustmentDates = (recurringAdjustment: RecurringAdjustment, account: Account) => {
  const currentAccountPeriod = getCurrentPeriod(account);
  const now = dayjs();
  return calculateOccurences({
    interval: recurringAdjustment.interval,
    initialDate: recurringAdjustment.initialDate,
    calculateStartDate: now,
    calculateEndDate: currentAccountPeriod.end,
    limit: recurringAdjustment.amountLeft,
    intervalType: recurringAdjustment.intervalType,
  });
};