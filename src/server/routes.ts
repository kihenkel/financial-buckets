import { Session } from 'next-auth';
import db from '@/server/db';
import { DeleteDataRequest, ImportData, PartialData } from '@/models';
import {
  accountService,
  adjustmentService,
  bucketService,
  recurringAdjustmentService,
  recurringTransactionService,
  settingsService,
  transactionService,
  userService,
} from './services';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { parseBuckets, parseTransactions } from '@/utils/importBucketsUtils';
dayjs.extend(weekOfYear);

export async function fetchData(session: Session, accountId?: string) {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }
  const user = await userService.getFromSession(session);
  const settings = await settingsService.getByUser(user);
  const accounts = await accountService.getAll(user);
  const account = accountId ? accounts.find((account) => account.id === accountId) : accounts[0];
  if (!account) {
    throw new Error(`Could not find account with id ${accountId}`);
  }
  const buckets = await bucketService.getAllBy('accountId', [account], user);
  const transactions = await transactionService.getAllBy('bucketId', buckets, user);
  const recurringTransactions = await recurringTransactionService.getAllBy('bucketId', buckets, user);
  const newTransactions = await recurringTransactionService.createNewTransactions(user, recurringTransactions, account);
  const existingAdjustments = await adjustmentService.getAllBy('accountId', [account], user);
  const recurringAdjustments = await recurringAdjustmentService.getAllBy('accountId', [account], user);
  const adjustments = await recurringAdjustmentService.syncAdjustments(existingAdjustments, recurringAdjustments, account, user);

  await accountService.refreshAccountAccess(account.id, user);

  return {
    user,
    settings,
    accounts,
    buckets,
    transactions: [...transactions, ...newTransactions],
    recurringTransactions,
    adjustments,
    recurringAdjustments,
  };
}

export async function updateData(session: Session, data: PartialData) {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  const user = data.user && await userService.update(data.user, sessionUser);
  const settings = data.settings && await settingsService.updateOrAdd([data.settings], sessionUser);
  const accounts = data.accounts && await accountService.updateOrAdd(data.accounts, sessionUser);
  const buckets = data.buckets && await bucketService.updateOrAdd(data.buckets, sessionUser);
  const transactions = data.transactions && await transactionService.updateOrAdd(data.transactions, sessionUser);
  const recurringTransactions = data.recurringTransactions && await recurringTransactionService.updateOrAdd(data.recurringTransactions, sessionUser);
  const adjustments = data.adjustments && await adjustmentService.updateOrAdd(data.adjustments, sessionUser);
  const recurringAdjustments = data.recurringAdjustments && await recurringAdjustmentService.updateOrAdd(data.recurringAdjustments, sessionUser);

  return { user, settings, accounts, buckets, transactions, recurringTransactions, adjustments, recurringAdjustments };
}

export async function deleteData(session: Session, data: DeleteDataRequest) {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  data.accounts && await accountService.deleteAll(data.accounts, sessionUser);
  data.buckets && await bucketService.deleteAll(data.buckets, sessionUser);
  data.transactions && await transactionService.deleteAll(data.transactions, sessionUser);
  data.recurringTransactions && await recurringTransactionService.deleteAll(data.recurringTransactions, sessionUser);
  data.adjustments && await adjustmentService.deleteAll(data.adjustments, sessionUser);
  data.recurringAdjustments && await recurringAdjustmentService.deleteAll(data.recurringAdjustments, sessionUser);

  return;
}

export async function importData(session: Session, importData: ImportData) {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  const account = await accountService.get(importData.accountId, sessionUser);
  const newBuckets = parseBuckets(importData.buckets, account, sessionUser);
  const buckets = await bucketService.updateOrAdd(newBuckets, sessionUser);
  const newTransactions = parseTransactions(importData.buckets, buckets, sessionUser);
  const transactions = await transactionService.updateOrAdd(newTransactions, sessionUser);

  return { buckets, transactions };
}