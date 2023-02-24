import { Account } from './Account';
import { Adjustment } from './Adjustment';
import { Bucket } from './Bucket';
import { RecurringAdjustment } from './RecurringAdjustment';
import { RecurringTransaction } from './RecurringTransaction';
import { Setting } from './Setting';
import { Transaction } from './Transaction';
import { User } from './User';

export interface Data {
  user: User;
  settings: Setting[];
  accounts: Account[];
  buckets: Bucket[];
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  adjustments: Adjustment[];
  recurringAdjustments: RecurringAdjustment[];
}

export interface PartialData {
  user?: Partial<User>;
  settings?: Partial<Setting>[];
  accounts?: Partial<Account>[];
  buckets?: Partial<Bucket>[];
  transactions?: Partial<Transaction>[];
  recurringTransactions?: Partial<RecurringTransaction>[];
  adjustments?: Partial<Adjustment>[];
  recurringAdjustments?: Partial<RecurringAdjustment>[];
}

export interface DeleteDataRequest {
  // Deleting users not allowed currently
  // users?: string[];
  // Deleting settings not allowed currently
  // settings?: string[];
  accounts?: string[];
  buckets?: string[];
  transactions?: string[];
  recurringTransactions?: string[];
  adjustments?: string[];
  recurringAdjustments?: string[];
}
