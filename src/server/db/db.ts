import mongodbAdapter from '@/server/db/mongodb';
import memorydbAdapter from '@/server/db/memorydb';
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
  Settings, settingsDisplayName,
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
  settingsSchemaNew, settingsSchemaUpdate,
 } from '@/models/schemas';
import { Query } from './Query';
import { withValidatedSchema } from '@/models/schemas/validateSchema';

const dbAdapter = memorydbAdapter;

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
  addAccount(data: any): Promise<Account>;
  addAccounts(data: any[]): Promise<Account[]>;
  updateAccount(query: Query, data: any): Promise<Account>;
  updateAccounts(queries: Query[], dataList: any[]): Promise<Account[]>;
  deleteAccounts(query: Query): Promise<void>;

  // Bucket
  getAllBuckets(query?: Query): Promise<Bucket[]>;
  getFirstBucket(query?: Query): Promise<Bucket>;
  getBucket(id: string): Promise<Bucket>;
  addBucket(data: any): Promise<Bucket>;
  addBuckets(data: any[]): Promise<Bucket[]>;
  updateBucket(query: Query, data: any): Promise<Bucket>;
  updateBuckets(queries: Query[], dataList: any[]): Promise<Bucket[]>;
  deleteBuckets(query: Query): Promise<void>;

  // Transaction
  getAllTransactions(query?: Query): Promise<Transaction[]>;
  getFirstTransaction(query?: Query): Promise<Transaction>;
  getTransaction(id: string): Promise<Transaction>;
  addTransaction(data: any): Promise<Transaction>;
  addTransactions(data: any[]): Promise<Transaction[]>;
  updateTransaction(query: Query, data: any): Promise<Transaction>;
  updateTransactions(queries: Query[], dataList: any[]): Promise<Transaction[]>;
  deleteTransactions(query: Query): Promise<void>;

  // RecurringTransaction
  getAllRecurringTransactions(query?: Query): Promise<RecurringTransaction[]>;
  getFirstRecurringTransaction(query?: Query): Promise<RecurringTransaction>;
  getRecurringTransaction(id: string): Promise<RecurringTransaction>;
  addRecurringTransaction(data: any): Promise<RecurringTransaction>;
  addRecurringTransactions(data: any[]): Promise<RecurringTransaction[]>;
  updateRecurringTransaction(query: Query, data: any): Promise<RecurringTransaction>;
  updateRecurringTransactions(queries: Query[], dataList: any[]): Promise<RecurringTransaction[]>;
  deleteRecurringTransactions(query: Query): Promise<void>;

  // Balance
  getAllBalances(query?: Query): Promise<Balance[]>;
  getFirstBalance(query?: Query): Promise<Balance>;
  getBalance(id: string): Promise<Balance>;
  addBalance(data: any): Promise<Balance>;
  addBalances(data: any[]): Promise<Balance[]>;
  updateBalance(query: Query, data: any): Promise<Balance>;
  updateBalances(queries: Query[], dataList: any[]): Promise<Balance[]>;
  deleteBalances(query: Query): Promise<void>;

  // Adjustment
  getAllAdjustments(query?: Query): Promise<Adjustment[]>;
  getFirstAdjustment(query?: Query): Promise<Adjustment>;
  getAdjustment(id: string): Promise<Adjustment>;
  addAdjustment(data: any): Promise<Adjustment>;
  addAdjustments(data: any[]): Promise<Adjustment[]>;
  updateAdjustment(query: Query, data: any): Promise<Adjustment>;
  updateAdjustments(queries: Query[], dataList: any[]): Promise<Adjustment[]>;
  deleteAdjustments(query: Query): Promise<void>;

  // RecurringAdjustment
  getAllRecurringAdjustments(query?: Query): Promise<RecurringAdjustment[]>;
  getFirstRecurringAdjustment(query?: Query): Promise<RecurringAdjustment>;
  getRecurringAdjustment(id: string): Promise<RecurringAdjustment>;
  addRecurringAdjustment(data: any): Promise<RecurringAdjustment>;
  addRecurringAdjustments(data: any[]): Promise<RecurringAdjustment[]>;
  updateRecurringAdjustment(query: Query, data: any): Promise<RecurringAdjustment>;
  updateRecurringAdjustments(queries: Query[], dataList: any[]): Promise<RecurringAdjustment[]>;
  deleteRecurringAdjustments(query: Query): Promise<void>;

  // Setting
  getFirstSettings(query?: Query): Promise<Settings>;
  getSettings(id: string): Promise<Settings>;
  addSettings(data: any | any[]): Promise<Settings>;
  updateSettings(query: Query, data: any): Promise<Settings>;
  deleteSettings(query: Query): Promise<void>;
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
  addAccounts: (dataList) => withValidatedSchema(accountSchemaNew, dataList, () => dbAdapter.addAll(accountDisplayName, dataList)),
  updateAccount: (query, data) => withValidatedSchema(accountSchemaUpdate, data, () => dbAdapter.update(accountDisplayName, query, data)),
  updateAccounts: (queries, dataList) => withValidatedSchema(accountSchemaUpdate, dataList, () => dbAdapter.updateAll(accountDisplayName, queries, dataList)),
  deleteAccounts: (query) => dbAdapter.deleteAll(accountDisplayName, query),

  // Bucket
  getAllBuckets: (query) => dbAdapter.getAll(bucketDisplayName, query),
  getFirstBucket: (query) => dbAdapter.getFirst(bucketDisplayName, query),
  getBucket: (id) => dbAdapter.get(bucketDisplayName, id),
  addBucket: (data) => withValidatedSchema(bucketSchemaNew, data, () => dbAdapter.add(bucketDisplayName, data)),
  addBuckets: (dataList) => withValidatedSchema(bucketSchemaNew, dataList, () => dbAdapter.addAll(bucketDisplayName, dataList)),
  updateBucket: (query, data) => withValidatedSchema(bucketSchemaUpdate, data, () => dbAdapter.update(bucketDisplayName, query, data)),
  updateBuckets: (queries, dataList) => withValidatedSchema(bucketSchemaUpdate, dataList, () => dbAdapter.updateAll(bucketDisplayName, queries, dataList)),
  deleteBuckets: (query) => dbAdapter.deleteAll(bucketDisplayName, query),

  // Transaction
  getAllTransactions: (query) => dbAdapter.getAll(transactionDisplayName, query),
  getFirstTransaction: (query) => dbAdapter.getFirst(transactionDisplayName, query),
  getTransaction: (id) => dbAdapter.get(transactionDisplayName, id),
  addTransaction: (data) => withValidatedSchema(transactionSchemaNew, data, () => dbAdapter.add(transactionDisplayName, data)),
  addTransactions: (dataList) => withValidatedSchema(transactionSchemaNew, dataList, () => dbAdapter.addAll(transactionDisplayName, dataList)),
  updateTransaction: (query, data) => withValidatedSchema(transactionSchemaUpdate, data, () => dbAdapter.update(transactionDisplayName, query, data)),
  updateTransactions: (queries, dataList) => withValidatedSchema(transactionSchemaUpdate, dataList, () => dbAdapter.updateAll(transactionDisplayName, queries, dataList)),
  deleteTransactions: (query) => dbAdapter.deleteAll(transactionDisplayName, query),

  // RecurringTransaction
  getAllRecurringTransactions: (query) => dbAdapter.getAll(recurringTransactionDisplayName, query),
  getFirstRecurringTransaction: (query) => dbAdapter.getFirst(recurringTransactionDisplayName, query),
  getRecurringTransaction: (id) => dbAdapter.get(recurringTransactionDisplayName, id),
  addRecurringTransaction: (data) => withValidatedSchema(recurringTransactionSchemaNew, data, () => dbAdapter.add(recurringTransactionDisplayName, data)),
  addRecurringTransactions: (dataList) => withValidatedSchema(recurringTransactionSchemaNew, dataList, () => dbAdapter.addAll(recurringTransactionDisplayName, dataList)),
  updateRecurringTransaction: (query, data) => withValidatedSchema(recurringTransactionSchemaUpdate, data, () => dbAdapter.update(recurringTransactionDisplayName, query, data)),
  updateRecurringTransactions: (queries, dataList) => withValidatedSchema(recurringTransactionSchemaUpdate, dataList, () => dbAdapter.updateAll(recurringTransactionDisplayName, queries, dataList)),
  deleteRecurringTransactions: (query) => dbAdapter.deleteAll(recurringTransactionDisplayName, query),

  // Balance
  getAllBalances: (query) => dbAdapter.getAll(balanceDisplayName, query),
  getFirstBalance: (query) => dbAdapter.getFirst(balanceDisplayName, query),
  getBalance: (id) => dbAdapter.get(balanceDisplayName, id),
  addBalance: (data) => withValidatedSchema(balanceSchemaNew, data, () => dbAdapter.add(balanceDisplayName, data)),
  addBalances: (dataList) => withValidatedSchema(balanceSchemaNew, dataList, () => dbAdapter.addAll(balanceDisplayName, dataList)),
  updateBalance: (query, data) => withValidatedSchema(balanceSchemaUpdate, data, () => dbAdapter.update(balanceDisplayName, query, data)),
  updateBalances: (queries, dataList) => withValidatedSchema(balanceSchemaUpdate, dataList, () => dbAdapter.updateAll(balanceDisplayName, queries, dataList)),
  deleteBalances: (query) => dbAdapter.deleteAll(balanceDisplayName, query),

  // Adjustment
  getAllAdjustments: (query) => dbAdapter.getAll(adjustmentDisplayName, query),
  getFirstAdjustment: (query) => dbAdapter.getFirst(adjustmentDisplayName, query),
  getAdjustment: (id) => dbAdapter.get(adjustmentDisplayName, id),
  addAdjustment: (data) => withValidatedSchema(adjustmentSchemaNew, data, () => dbAdapter.add(adjustmentDisplayName, data)),
  addAdjustments: (dataList) => withValidatedSchema(adjustmentSchemaNew, dataList, () => dbAdapter.addAll(adjustmentDisplayName, dataList)),
  updateAdjustment: (query, data) => withValidatedSchema(adjustmentSchemaUpdate, data, () => dbAdapter.update(adjustmentDisplayName, query, data)),
  updateAdjustments: (queries, dataList) => withValidatedSchema(adjustmentSchemaUpdate, dataList, () => dbAdapter.updateAll(adjustmentDisplayName, queries, dataList)),
  deleteAdjustments: (query) => dbAdapter.deleteAll(adjustmentDisplayName, query),

  // RecurringAdjustment
  getAllRecurringAdjustments: (query) => dbAdapter.getAll(recurringAdjustmentDisplayName, query),
  getFirstRecurringAdjustment: (query) => dbAdapter.getFirst(recurringAdjustmentDisplayName, query),
  getRecurringAdjustment: (id) => dbAdapter.get(recurringAdjustmentDisplayName, id),
  addRecurringAdjustment: (data) => withValidatedSchema(recurringAdjustmentSchemaNew, data, () => dbAdapter.add(recurringAdjustmentDisplayName, data)),
  addRecurringAdjustments: (dataList) => withValidatedSchema(recurringAdjustmentSchemaNew, dataList, () => dbAdapter.addAll(recurringAdjustmentDisplayName, dataList)),
  updateRecurringAdjustment: (query, data) => withValidatedSchema(recurringAdjustmentSchemaUpdate, data, () => dbAdapter.update(recurringAdjustmentDisplayName, query, data)),
  updateRecurringAdjustments: (queries, dataList) => withValidatedSchema(recurringAdjustmentSchemaUpdate, dataList, () => dbAdapter.updateAll(recurringAdjustmentDisplayName, queries, dataList)),
  deleteRecurringAdjustments: (query) => dbAdapter.deleteAll(recurringAdjustmentDisplayName, query),

  // Setting
  getFirstSettings: (query) => dbAdapter.getFirst(settingsDisplayName, query),
  getSettings: (id) => dbAdapter.get(settingsDisplayName, id),
  addSettings: (data) => withValidatedSchema(settingsSchemaNew, data, () => dbAdapter.add(settingsDisplayName, data)),
  updateSettings: (query, data) => withValidatedSchema(settingsSchemaUpdate, data, () => dbAdapter.update(settingsDisplayName, query, data)),
  deleteSettings: (query) => dbAdapter.deleteAll(settingsDisplayName, query),
};

export default db;
