export type IntervalType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'semiMonthly';

export const Interval = {
  daily: { label: 'Daily', plural: 'days' },
  weekly: { label: 'Weekly', plural: 'weeks' },
  semiMonthly: { label: 'Semi-monthly (1st and 15th)', plural: '' },
  monthly: { label: 'Monthly', plural: 'months' },
  yearly: { label: 'Yearly', plural: 'years' },
};

export const Intervals = Object.entries(Interval);

export interface IntervalModel {
  intervalType: IntervalType;
  interval: number;
  initialDate: string;
  isLimited: boolean;
  amountLeft: number;
  lastRun: string;
}