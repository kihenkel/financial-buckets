import db from '@/server/db';
import { Account, User } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';

export async function getAccountsFromUser(user: User): Promise<Account[]> {
  const query = new Query<Account>().findBy('userId', user.id);
  let accounts = await db.getAllAccounts(query);
  if (!accounts.length) {
    await db.addAccount({
      userId: user.id,
      balance: 0,
    });
    accounts = await db.getAllAccounts(query);
  }
  return accounts;
}

export async function getAccount(user: User, accountId: string): Promise<Account> {
  const query = new Query<Account>().findById(accountId).findBy('userId', user.id);
  return db.getFirstAccount(query);
}

async function updateAccount(newAccount: Partial<Account>, user: User): Promise<Account> {
  if (!newAccount.id) {
    throw new Error('Failed to update: Missing account id!');
  }
  logger.info(`Updating account ${newAccount.id} ...`);
  const query = new Query<Account>().findById(newAccount.id).findBy('userId', user.id);
  const updatedAccount = await db.updateAccount(query, newAccount);
  if (!updatedAccount) {
    logger.warning(`Could not find and update account with id ${newAccount.id} and userId ${user.id}!`);
  }
  return updatedAccount;
}

export async function updateAccounts(newAccounts: Partial<Account>[], user: User): Promise<Account[]> {
  logger.info(`Updating ${newAccounts.length} accounts ...`);

  const updatedAccounts = await chainPromises(newAccounts, (account: Partial<Account>) => updateAccount(account, user));
  return updatedAccounts;
}

export async function refreshAccountAccess(accountId: string, user: User): Promise<void> {
  logger.info(`Updating last access for account ${accountId} ...`);
  await updateAccount({ id: accountId, lastAccess: new Date().toISOString() }, user);
};

export async function deleteAccounts(ids: string[], user: User): Promise<void> {
  logger.info(`Deleting ${ids.length} accounts ...`);
  const query = new Query<Account>().findByIds(ids).findBy('userId', user.id);
  return db.deleteAccounts(query);
}
