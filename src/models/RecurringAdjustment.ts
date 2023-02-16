import { DatabaseModel } from './DatabaseModel';

export const recurringAdjustmentDisplayName = 'RecurringAdjustment';

export interface RecurringAdjustment extends DatabaseModel {
  accountId: string;
  amount: number;
  label: string;
  description: string;
  dayOfMonth: number;
}
