import { Session } from 'next-auth';
import db from '@/server/db';
import { Account, Adjustment, DeleteDataRequest, ImportData, PartialData, Transaction } from '@/models';
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
import { chainPromises } from '@/utils/chainPromises';
dayjs.extend(weekOfYear);

interface RouteResult {
  status: number;
  data?: any;
}

export async function fetchData(session: Session, accountId?: string): Promise<RouteResult> {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }
  const user = await userService.getFromSession(session);
  const [settings, allAccounts] = await Promise.all([
    settingsService.getByUser(user),
    accountService.getAllOrDefault(user),
  ]);
  const selectedAccount = accountId ? allAccounts.find((account) => account.id === accountId) : undefined;
  const accounts = accountId ? [selectedAccount].filter((acc): acc is Account => !!acc) : allAccounts;
  if (accounts.length <= 0) {
    return { status: 404, data: `Could not find account with id ${accountId}` };
  }
  const [[buckets, transactions, recurringTransactions], existingAdjustments, recurringAdjustments] = await Promise.all([
    bucketService.getAllBy('accountId', accounts, user)
      .then((theBuckets) => {
        return Promise.all([
          transactionService.getAllByBuckets(theBuckets, user),
          recurringTransactionService.getAllBy('bucketId', theBuckets, user),
        ])
          .then(([theTransactions, theRecurringTransactions]) => {
            return [theBuckets, theTransactions, theRecurringTransactions] as const;
          });
      }),
      adjustmentService.getAllBy('accountId', accounts, user),
      recurringAdjustmentService.getAllBy('accountId', accounts, user),
  ]);

  // Only when specific account is selected
  let newTransactions: Transaction[] = [];
  let adjustments: Adjustment[] = [];
  let createdAdjustments: Adjustment[] = [];
  let removedAdjustments: Adjustment[] = [];
  if (selectedAccount) {
    newTransactions = await recurringTransactionService.createNewTransactions(user, recurringTransactions, selectedAccount);
    ({
      adjustments,
      created: createdAdjustments,
      removed: removedAdjustments
    } = await recurringAdjustmentService.syncAdjustments(existingAdjustments, recurringAdjustments, selectedAccount, user));

    await accountService.refreshAccountAccess(selectedAccount.id, user);
  }

  return {
    status: 200,
    data: {
      user,
      settings,
      accounts: allAccounts,
      buckets,
      transactions: [...transactions, ...newTransactions],
      recurringTransactions,
      adjustments,
      recurringAdjustments,
      changes: {
        createdTransactions: newTransactions,
        createdAdjustments,
        removedAdjustments,
      },
    },
  };
}

export async function updateData(session: Session, data: PartialData): Promise<RouteResult> {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  const user = data.user && (await userService.update(data.user, sessionUser));
  const settings = data.settings && (await settingsService.updateOrAdd([data.settings], sessionUser));
  const accounts = data.accounts && (await accountService.updateOrAdd(data.accounts, sessionUser));
  const buckets = data.buckets && (await bucketService.updateOrAdd(data.buckets, sessionUser));
  const transactions = data.transactions && (await transactionService.updateOrAdd(data.transactions, sessionUser));
  const recurringTransactions = data.recurringTransactions && (await recurringTransactionService.updateOrAdd(data.recurringTransactions, sessionUser));
  const adjustments = data.adjustments && (await adjustmentService.updateOrAdd(data.adjustments, sessionUser));
  const recurringAdjustments = data.recurringAdjustments && (await recurringAdjustmentService.updateOrAdd(data.recurringAdjustments, sessionUser));

  return {
    status: 200,
    data: { user, settings, accounts, buckets, transactions, recurringTransactions, adjustments, recurringAdjustments }
  };
}

export async function deleteData(session: Session, data: DeleteDataRequest): Promise<RouteResult> {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  data.accounts && (await accountService.deleteAll(data.accounts, sessionUser));
  data.buckets && (await bucketService.deleteAll(data.buckets, sessionUser));
  data.transactions && (await transactionService.deleteAll(data.transactions, sessionUser));
  data.recurringTransactions && (await recurringTransactionService.deleteAll(data.recurringTransactions, sessionUser));
  data.adjustments && (await adjustmentService.deleteAll(data.adjustments, sessionUser));
  data.recurringAdjustments && (await recurringAdjustmentService.deleteAll(data.recurringAdjustments, sessionUser));

  return { status: 200 };
};

export async function importData(session: Session, importData: ImportData): Promise<RouteResult> {
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

  return { status: 200, data: { buckets, transactions } };
};

export async function optimize(session: Session, bucketId: string, maxTransactions: number): Promise<RouteResult> {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  await bucketService.optimize(bucketId, maxTransactions, sessionUser);

  return { status: 200, data: { success: true } };
}

export async function optimizeAll(session: Session, accountId: string, maxTransactions: number): Promise<RouteResult> {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await userService.getFromSession(session);
  const account = await accountService.get(accountId, sessionUser);
  const buckets = await bucketService.getAllBy('accountId', [account], sessionUser);
  await chainPromises(buckets, (bucket) => bucketService.optimize(bucket.id, maxTransactions, sessionUser));

  return { status: 200, data: { success: true } };
}