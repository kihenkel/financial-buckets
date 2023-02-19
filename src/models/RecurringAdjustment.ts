import { DatabaseModel } from './DatabaseModel';
import { IntervalModel } from './IntervalModel';

export const recurringAdjustmentDisplayName = 'RecurringAdjustment';

export interface RecurringAdjustment extends DatabaseModel, IntervalModel {
  accountId: string;
  label: string;
  amount: number;
  description: string;
}
