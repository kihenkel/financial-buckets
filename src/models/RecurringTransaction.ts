import { DatabaseModel } from './DatabaseModel';
import { IntervalModel } from './IntervalModel';

export const recurringTransactionDisplayName = 'RecurringTransaction';

export interface RecurringTransaction extends DatabaseModel, IntervalModel {
  bucketId: string;
  amount: number;
  description: string;
}
