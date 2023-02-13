import { DatabaseModel } from './DatabaseModel';

export const accountDisplayName = 'Account';

export type AccountCycle = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

export interface Account extends DatabaseModel {
  name: string;
  balance: number;
  cycle: AccountCycle;
}
