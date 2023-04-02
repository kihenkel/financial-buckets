import dayjs, { ManipulateType } from 'dayjs';
import { IntervalType } from '@/models';

type DayjsIntervalType = Extract<ManipulateType, 'days' | 'weeks' | 'months' | 'years'>;

interface CalculateOccurencesPropsInternal {
  interval: number;
  initialDate: dayjs.Dayjs;
  calculateStartDate: dayjs.Dayjs;
  calculateEndDate?: dayjs.Dayjs;
  limit: number;
}

interface CalculateOccurencesProps {
  interval: number;
  initialDate: dayjs.Dayjs | string;
  calculateStartDate: dayjs.Dayjs | string | number;
  calculateEndDate?: dayjs.Dayjs | string | number;
  limit: number;
  intervalType: IntervalType;
}

const DAY_IN_MS = 1 * 24 * 60 * 60 * 1000;
const WEEK_IN_MS = DAY_IN_MS * 7;

const getRealStartDate = (dayjsIntervalType: DayjsIntervalType, { interval, initialDate, calculateStartDate }: CalculateOccurencesPropsInternal): dayjs.Dayjs => {
  if (initialDate.isAfter(calculateStartDate)) {
    return initialDate;
  }
  if (dayjsIntervalType === 'days') {
    const diffMs = calculateStartDate.diff(initialDate, 'ms', true);
    const intervalMs = interval * DAY_IN_MS;
    const offset = intervalMs - (diffMs % intervalMs);
    return calculateStartDate.add(offset, 'ms');
  } else if (dayjsIntervalType === 'weeks') {
    const diffMs = calculateStartDate.diff(initialDate, 'ms', true);
    const intervalMs = interval * WEEK_IN_MS;
    const offset = intervalMs - (diffMs % intervalMs);
    return calculateStartDate.add(offset, 'ms');
  } else if (dayjsIntervalType === 'months') {
    const diff = calculateStartDate.diff(initialDate, dayjsIntervalType, true);
    const offset = Math.ceil(diff / interval) * interval;
    return initialDate.add(offset, dayjsIntervalType);
  } else if (dayjsIntervalType === 'years') {
    const diff = calculateStartDate.diff(initialDate, dayjsIntervalType, true);
    const offset = Math.ceil(diff / interval) * interval;
    return initialDate.add(offset, dayjsIntervalType);
  }
  throw new Error(`Type ${dayjsIntervalType} not supported`);
};

const calculateWith = (dayjsIntervalType: DayjsIntervalType, propsInternal: CalculateOccurencesPropsInternal ): string[] => {
  const actualInitialDate = getRealStartDate(dayjsIntervalType, propsInternal);

  const { interval, calculateEndDate, limit } = propsInternal;
  return Array(limit)
    .fill(interval)
    .map((currentInterval, index) => currentInterval * index)
    .reduce((currentOccurences: string[], offset) => {
      const newDate = actualInitialDate.add(offset, dayjsIntervalType);
      if (calculateEndDate && newDate.isAfter(calculateEndDate)) {
        return currentOccurences;
      }
      return [
        ...currentOccurences,
        newDate.format()
      ];
    }, []);
};

const calculateSemiMonthly = (propsInternal: CalculateOccurencesPropsInternal ): string[] | null => {
  const monthlyOnFirst = calculateWith('months', { ...propsInternal, interval: 1, initialDate: dayjs(propsInternal.initialDate).date(1) });
  const monthlyOnFifteenth = calculateWith('months', { ...propsInternal, interval: 1, initialDate: dayjs(propsInternal.initialDate).date(15) });

  return [...monthlyOnFirst, ...monthlyOnFifteenth];
};

export const calculateOccurences = ({ interval, initialDate, calculateStartDate, calculateEndDate, limit, intervalType }: CalculateOccurencesProps): string[] | null => {
  if (!intervalType || !initialDate || (intervalType !== 'semiMonthly' && interval <= 0)) {
    return null;
  }

  const propsInternal: CalculateOccurencesPropsInternal = {
    interval,
    limit,
    initialDate: dayjs.isDayjs(initialDate) ? initialDate : dayjs(initialDate),
    calculateStartDate: dayjs.isDayjs(calculateStartDate) ? calculateStartDate : dayjs(calculateStartDate),
    calculateEndDate: calculateEndDate ? (dayjs.isDayjs(calculateEndDate) ? calculateEndDate : dayjs(calculateEndDate)) : undefined,
  };
  switch(intervalType) {
    case 'daily': return calculateWith('days', propsInternal);
    case 'weekly': return calculateWith('weeks', propsInternal);
    case 'semiMonthly': return calculateSemiMonthly(propsInternal);
    case 'monthly': return calculateWith('months', propsInternal);
    case 'yearly': return calculateWith('years', propsInternal);
    default: return null;
  }
};