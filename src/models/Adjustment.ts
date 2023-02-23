import { DatabaseModel } from './DatabaseModel';

export const adjustmentDisplayName = 'Adjustment';

export interface Adjustment extends DatabaseModel {
  accountId: string;
  amount: number;
  label: string;
  date: string;
  description: string;
  recurringAdjustmentId: string;
  isNew: true;
}
