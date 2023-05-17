import { Account, User } from '@/models';
import db from '@/server/db';
import logger from '../logger';
import { createService, ServiceHandlers } from './createService';

const serviceHandlers: ServiceHandlers<Account> = {
  get: db.getAccount,
  getAll: db.getAllAccounts,
  add: db.addAccount,
  addAll: db.addAccounts,
  update: db.updateAccount,
  updateAll: db.updateAccounts,
  deleteAll: db.deleteAccounts,
};

const service = createService('account', serviceHandlers);

const refreshAccountAccess = async (accountId: string, user: User): Promise<void> => {
  logger.info(`Updating last access for account ${accountId} ...`);
  await service.updateOrAdd([{ id: accountId, lastAccess: new Date().toISOString() }], user);
};

const getAllOrDefault = async (user: User): Promise<Account[]> => {
  const accounts = await service.getAll(user);
  if (accounts.length <= 0) {
    logger.info(`No accounts found for user ${user.id} creating new default account ...`);
    await service.add({ userId: user.id, balance: 0 }, user);
    return service.getAll(user);
  }
  return accounts;
};

export const accountService = {
  ...service,
  refreshAccountAccess,
  getAllOrDefault,
};
