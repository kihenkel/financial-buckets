import { Session } from 'next-auth';
import db from '@/server/db';
import { DeleteDataRequest, PartialData } from '@/models';
import { getUserFromSession, updateUser } from './user';
import { deleteAccounts, getAccount, getAccountsFromUser, updateAccounts } from './account';
import { deleteBuckets, getBuckets, updateBuckets } from './bucket';
import { deleteTransactions, getTransactions, updateTransactions } from './transaction';
import { deleteAdjustments, getAdjustments, updateAdjustments } from './adjustment';
import { deleteRecurringTransactions, getRecurringTransactions, updateRecurringTransactions } from './recurringTransaction';
import { deleteRecurringAdjustments, getRecurringAdjustments, updateRecurringAdjustments } from './recurringAdjustment';

export async function fetchData(session: Session, accountId?: string) {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }
  const user = await getUserFromSession(session);
  const account = accountId ? await getAccount(user, accountId) : (await getAccountsFromUser(user))[0];
  const buckets = await getBuckets(user, account);
  const transactions = await getTransactions(user, buckets);
  const recurringTransactions = await getRecurringTransactions(user, buckets);
  const adjustments = await getAdjustments(user, account);
  const recurringAdjustments = await getRecurringAdjustments(user, account);

  return {
    user,
    accounts: [account],
    buckets,
    transactions,
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

  const sessionUser = await getUserFromSession(session);
  const user = data.user && await updateUser(data.user, sessionUser);
  const accounts = data.accounts && await updateAccounts(data.accounts, sessionUser);
  const buckets = data.buckets && await updateBuckets(data.buckets, sessionUser);
  const transactions = data.transactions && await updateTransactions(data.transactions, sessionUser);
  const recurringTransactions = data.recurringTransactions && await updateRecurringTransactions(data.recurringTransactions, sessionUser);
  const adjustments = data.adjustments && await updateAdjustments(data.adjustments, sessionUser);
  const recurringAdjustments = data.recurringAdjustments && await updateRecurringAdjustments(data.recurringAdjustments, sessionUser);

  return { user, accounts, buckets, transactions, recurringTransactions, adjustments, recurringAdjustments };
}

export async function deleteData(session: Session, data: DeleteDataRequest) {
  const isConnected = await db.isConnected();
  if (!isConnected) {
    await db.connect();
  }

  const sessionUser = await getUserFromSession(session);
  data.accounts && await deleteAccounts(data.accounts, sessionUser);
  data.buckets && await deleteBuckets(data.buckets, sessionUser);
  data.transactions && await deleteTransactions(data.transactions, sessionUser);
  data.recurringTransactions && await deleteRecurringTransactions(data.recurringTransactions, sessionUser);
  data.adjustments && await deleteAdjustments(data.adjustments, sessionUser);
  data.recurringAdjustments && await deleteRecurringAdjustments(data.recurringAdjustments, sessionUser);

  return;
}
