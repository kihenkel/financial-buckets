import { Account } from './Account';
import { Adjustment } from './Adjustment';
import { Bucket } from './Bucket';
import { RecurringAdjustment } from './RecurringAdjustment';
import { RecurringTransaction } from './RecurringTransaction';
import { Transaction } from './Transaction';
import { User } from './User';

export interface Data {
  user: User;
  accounts: Account[];
  buckets: Bucket[];
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  adjustments: Adjustment[];
  recurringAdjustments: RecurringAdjustment[];
}

export interface PartialData {
  user?: Partial<User>;
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
  accounts?: string[];
  buckets?: string[];
  transactions?: string[];
  recurringTransactions?: string[];
  adjustments?: string[];
  recurringAdjustments?: string[];
}
