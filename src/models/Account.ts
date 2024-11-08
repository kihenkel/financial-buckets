import { DatabaseModel } from './DatabaseModel';

export const accountDisplayName = 'Account';

export type AccountCycle = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
export type AccountType = 'checking' | 'savings' | 'cd'; 

export interface Account extends DatabaseModel {
  name: string;
  balance: number;
  initialBalance: number;
  cycle: AccountCycle;
  lastAccess: string;
  type: AccountType;
  interestRate?: number;
  openDate?: string;
  maturityDate?: string;
}
