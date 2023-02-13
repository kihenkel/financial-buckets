import mongodbAdapter from '@/server/db/mongodb';
import {
  DatabaseModelNoUserId,
  User, userDisplayName,
  Account, accountDisplayName,
  Bucket, bucketDisplayName,
  Transaction, transactionDisplayName,
  RecurringTransaction, recurringTransactionDisplayName,
  Balance, balanceDisplayName,
  Adjustment, adjustmentDisplayName,
  RecurringAdjustment, recurringAdjustmentDisplayName,
} from '@/models';
import {
  userSchemaNew, userSchemaUpdate,
  accountSchemaNew, accountSchemaUpdate,
  bucketSchemaNew, bucketSchemaUpdate,
  transactionSchemaNew, transactionSchemaUpdate,
  recurringTransactionSchemaNew, recurringTransactionSchemaUpdate,
  balanceSchemaNew, balanceSchemaUpdate,
  adjustmentSchemaNew, adjustmentSchemaUpdate,
  recurringAdjustmentSchemaNew, recurringAdjustmentSchemaUpdate,
 } from '@/models/schemas';
import { Query } from './Query';
import { withValidatedSchema } from '@/models/schemas/validateSchema';

const dbAdapter = mongodbAdapter;

interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean | Promise<boolean>;

  // User
  getAllUsers(query?: Query<DatabaseModelNoUserId>): Promise<User[]>;
  getFirstUser(query?: Query<DatabaseModelNoUserId>): Promise<User>;
  getUser(id: string): Promise<User>;
  addUser(data: any | any[]): Promise<User>;
  updateUser(query: Query<DatabaseModelNoUserId>, data: any): Promise<User>;
  deleteUsers(query: Query<DatabaseModelNoUserId>): Promise<void>;

  // Account
  getAllAccounts(query?: Query): Promise<Account[]>;
  getFirstAccount(query?: Query): Promise<Account>;
  getAccount(id: string): Promise<Account>;
  addAccount(data: any | any[]): Promise<Account>;
  updateAccount(query: Query, data: any): Promise<Account>;
  deleteAccounts(query: Query): Promise<void>;

  // Bucket
  getAllBuckets(query?: Query): Promise<Bucket[]>;
  getFirstBucket(query?: Query): Promise<Bucket>;
  getBucket(id: string): Promise<Bucket>;
  addBucket(data: any | any[]): Promise<Bucket>;
  updateBucket(query: Query, data: any): Promise<Bucket>;
  deleteBuckets(query: Query): Promise<void>;

  // Transaction
  getAllTransactions(query?: Query): Promise<Transaction[]>;
  getFirstTransaction(query?: Query): Promise<Transaction>;
  getTransaction(id: string): Promise<Transaction>;
  addTransaction(data: any | any[]): Promise<Transaction>;
  updateTransaction(query: Query, data: any): Promise<Transaction>;
  deleteTransactions(query: Query): Promise<void>;

  // RecurringTransaction
  getAllRecurringTransactions(query?: Query): Promise<RecurringTransaction[]>;
  getFirstRecurringTransaction(query?: Query): Promise<RecurringTransaction>;
  getRecurringTransaction(id: string): Promise<RecurringTransaction>;
  addRecurringTransaction(data: any | any[]): Promise<RecurringTransaction>;
  updateRecurringTransaction(query: Query, data: any): Promise<RecurringTransaction>;
  deleteRecurringTransactions(query: Query): Promise<void>;

  // Balance
  getAllBalances(query?: Query): Promise<Balance[]>;
  getFirstBalance(query?: Query): Promise<Balance>;
  getBalance(id: string): Promise<Balance>;
  addBalance(data: any | any[]): Promise<Balance>;
  updateBalance(query: Query, data: any): Promise<Balance>;
  deleteBalances(query: Query): Promise<void>;

  // Adjustment
  getAllAdjustments(query?: Query): Promise<Adjustment[]>;
  getFirstAdjustment(query?: Query): Promise<Adjustment>;
  getAdjustment(id: string): Promise<Adjustment>;
  addAdjustment(data: any | any[]): Promise<Adjustment>;
  updateAdjustment(query: Query, data: any): Promise<Adjustment>;
  deleteAdjustments(query: Query): Promise<void>;

  // RecurringAdjustment
  getAllRecurringAdjustments(query?: Query): Promise<RecurringAdjustment[]>;
  getFirstRecurringAdjustment(query?: Query): Promise<RecurringAdjustment>;
  getRecurringAdjustment(id: string): Promise<RecurringAdjustment>;
  addRecurringAdjustment(data: any | any[]): Promise<RecurringAdjustment>;
  updateRecurringAdjustment(query: Query, data: any): Promise<RecurringAdjustment>;
  deleteRecurringAdjustments(query: Query): Promise<void>;
}

const db: Database = {
  connect: dbAdapter.connect,
  disconnect: dbAdapter.disconnect,
  isConnected: dbAdapter.isConnected,

  // User
  getAllUsers: (query) => dbAdapter.getAll(userDisplayName, query),
  getFirstUser: (query) => dbAdapter.getFirst(userDisplayName, query),
  getUser: (id) => dbAdapter.get(userDisplayName, id),
  addUser: (data) => withValidatedSchema(userSchemaNew, data, () => dbAdapter.add(userDisplayName, data)),
  updateUser: (query, data) => withValidatedSchema(userSchemaUpdate, data, () => dbAdapter.update(userDisplayName, query, data)),
  deleteUsers: (query) => dbAdapter.deleteAll(userDisplayName, query),

  // Account
  getAllAccounts: (query) => dbAdapter.getAll(accountDisplayName, query),
  getFirstAccount: (query) => dbAdapter.getFirst(accountDisplayName, query),
  getAccount: (id) => dbAdapter.get(accountDisplayName, id),
  addAccount: (data) => withValidatedSchema(accountSchemaNew, data, () => dbAdapter.add(accountDisplayName, data)),
  updateAccount: (query, data) => withValidatedSchema(accountSchemaUpdate, data, () => dbAdapter.update(accountDisplayName, query, data)),
  deleteAccounts: (query) => dbAdapter.deleteAll(accountDisplayName, query),

  // Bucket
  getAllBuckets: (query) => dbAdapter.getAll(bucketDisplayName, query),
  getFirstBucket: (query) => dbAdapter.getFirst(bucketDisplayName, query),
  getBucket: (id) => dbAdapter.get(bucketDisplayName, id),
  addBucket: (data) => withValidatedSchema(bucketSchemaNew, data, () => dbAdapter.add(bucketDisplayName, data)),
  updateBucket: (query, data) => withValidatedSchema(bucketSchemaUpdate, data, () => dbAdapter.update(bucketDisplayName, query, data)),
  deleteBuckets: (query) => dbAdapter.deleteAll(bucketDisplayName, query),

  // Transaction
  getAllTransactions: (query) => dbAdapter.getAll(transactionDisplayName, query),
  getFirstTransaction: (query) => dbAdapter.getFirst(transactionDisplayName, query),
  getTransaction: (id) => dbAdapter.get(transactionDisplayName, id),
  addTransaction: (data) => withValidatedSchema(transactionSchemaNew, data, () => dbAdapter.add(transactionDisplayName, data)),
  updateTransaction: (query, data) => withValidatedSchema(transactionSchemaUpdate, data, () => dbAdapter.update(transactionDisplayName, query, data)),
  deleteTransactions: (query) => dbAdapter.deleteAll(transactionDisplayName, query),

  // RecurringTransaction
  getAllRecurringTransactions: (query) => dbAdapter.getAll(recurringTransactionDisplayName, query),
  getFirstRecurringTransaction: (query) => dbAdapter.getFirst(recurringTransactionDisplayName, query),
  getRecurringTransaction: (id) => dbAdapter.get(recurringTransactionDisplayName, id),
  addRecurringTransaction: (data) => withValidatedSchema(recurringTransactionSchemaNew, data, () => dbAdapter.add(recurringTransactionDisplayName, data)),
  updateRecurringTransaction: (query, data) => withValidatedSchema(recurringTransactionSchemaUpdate, data, () => dbAdapter.update(recurringTransactionDisplayName, query, data)),
  deleteRecurringTransactions: (query) => dbAdapter.deleteAll(recurringTransactionDisplayName, query),

  // Balance
  getAllBalances: (query) => dbAdapter.getAll(balanceDisplayName, query),
  getFirstBalance: (query) => dbAdapter.getFirst(balanceDisplayName, query),
  getBalance: (id) => dbAdapter.get(balanceDisplayName, id),
  addBalance: (data) => withValidatedSchema(balanceSchemaNew, data, () => dbAdapter.add(balanceDisplayName, data)),
  updateBalance: (query, data) => withValidatedSchema(balanceSchemaUpdate, data, () => dbAdapter.update(balanceDisplayName, query, data)),
  deleteBalances: (query) => dbAdapter.deleteAll(balanceDisplayName, query),

  // Adjustment
  getAllAdjustments: (query) => dbAdapter.getAll(adjustmentDisplayName, query),
  getFirstAdjustment: (query) => dbAdapter.getFirst(adjustmentDisplayName, query),
  getAdjustment: (id) => dbAdapter.get(adjustmentDisplayName, id),
  addAdjustment: (data) => withValidatedSchema(adjustmentSchemaNew, data, () => dbAdapter.add(adjustmentDisplayName, data)),
  updateAdjustment: (query, data) => withValidatedSchema(adjustmentSchemaUpdate, data, () => dbAdapter.update(adjustmentDisplayName, query, data)),
  deleteAdjustments: (query) => dbAdapter.deleteAll(adjustmentDisplayName, query),

  // RecurringAdjustment
  getAllRecurringAdjustments: (query) => dbAdapter.getAll(recurringAdjustmentDisplayName, query),
  getFirstRecurringAdjustment: (query) => dbAdapter.getFirst(recurringAdjustmentDisplayName, query),
  getRecurringAdjustment: (id) => dbAdapter.get(recurringAdjustmentDisplayName, id),
  addRecurringAdjustment: (data) => withValidatedSchema(recurringAdjustmentSchemaNew, data, () => dbAdapter.add(recurringAdjustmentDisplayName, data)),
  updateRecurringAdjustment: (query, data) => withValidatedSchema(recurringAdjustmentSchemaUpdate, data, () => dbAdapter.update(recurringAdjustmentDisplayName, query, data)),
  deleteRecurringAdjustments: (query) => dbAdapter.deleteAll(recurringAdjustmentDisplayName, query),
};

export default db;
