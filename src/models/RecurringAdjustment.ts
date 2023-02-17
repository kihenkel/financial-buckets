import { DatabaseModel } from './DatabaseModel';

export const recurringAdjustmentDisplayName = 'RecurringAdjustment';

export interface RecurringAdjustment extends DatabaseModel {
  accountId: string;
  label: string;
  amount: number;
  description: string;
  dayOfMonth: number;
}
