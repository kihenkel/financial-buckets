import { DatabaseModel } from './DatabaseModel';

export const balanceDisplayName = 'Balance';

export interface Balance extends DatabaseModel {
  accountId: string;
  amount: number;
}
