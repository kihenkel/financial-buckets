import { DatabaseModel } from './DatabaseModel';

export const adjustmentDisplayName = 'Adjustment';

export interface Adjustment extends DatabaseModel {
  accountId: string;
  amount: number;
  label: string;
  description: string;
  validUntilTimestamp: number;
  recurringAdjustmentId: string;
}
