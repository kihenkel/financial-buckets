import db from '@/server/db';
import { User, RecurringAdjustment, Account } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';

async function updateRecurringAdjustment(newRecurringAdjustment: Partial<RecurringAdjustment>, user: User): Promise<RecurringAdjustment> {
  if (!newRecurringAdjustment.id) {
    throw new Error('Failed to update: Missing recurringAdjustment id!');
  }
  logger.info(`Updating recurringAdjustment ${newRecurringAdjustment.id} ...`);
  const query = new Query().findById(newRecurringAdjustment.id).findBy('userId', user.id);
  const updatedRecurringAdjustment = await db.updateRecurringAdjustment(query, newRecurringAdjustment);
  if (!updatedRecurringAdjustment) {
    logger.warning(`Could not find and update recurringAdjustment with id ${newRecurringAdjustment.id} and userId ${user.id}!`);
  }
  return updatedRecurringAdjustment;
}

async function addRecurringAdjustment(newRecurringAdjustment: Partial<RecurringAdjustment>, user: User): Promise<RecurringAdjustment> {
  logger.info(`Adding new recurringAdjustment for user ${user.id} ...`);
  if (newRecurringAdjustment.userId !== user.id) {
    throw new Error(`User id from recurringAdjustment ${newRecurringAdjustment.userId} and signed in user ${user.id} dont match. Aborting recurringAdjustment creation!`);
  }
  return db.addRecurringAdjustment(newRecurringAdjustment);
}

async function updateOrAddRecurringAdjustment(newRecurringAdjustment: Partial<RecurringAdjustment>, user: User): Promise<RecurringAdjustment> {
  if (newRecurringAdjustment.id) {
    return updateRecurringAdjustment(newRecurringAdjustment, user);
  } else {
    return addRecurringAdjustment(newRecurringAdjustment, user);
  }
}

async function deleteRecurringAdjustment(id: string, user: User): Promise<void> {
  logger.info(`Deleting recurringAdjustment ${id} ...`);
  const query = new Query().findById(id).findBy('userId', user.id);
  return db.deleteRecurringAdjustments(query);
}

export function getRecurringAdjustments(user: User, account: Account): Promise<RecurringAdjustment[]> {
  const query = new Query<RecurringAdjustment>().findBy('userId', user.id).findBy('accountId', account.id);
  return db.getAllRecurringAdjustments(query);
}

export async function updateRecurringAdjustments(newRecurringAdjustments: Partial<RecurringAdjustment>[], user: User): Promise<RecurringAdjustment[]> {
  logger.info(`Updating ${newRecurringAdjustments.length} recurringAdjustments ...`);

  const updatedRecurringAdjustments = await chainPromises(newRecurringAdjustments, (recurringAdjustment: Partial<RecurringAdjustment>) => updateOrAddRecurringAdjustment(recurringAdjustment, user));
  return updatedRecurringAdjustments;
}

export async function deleteRecurringAdjustments(ids: string[], user: User): Promise<void> {
  logger.info(`Deleting ${ids.length} recurringAdjustments ...`);

  await chainPromises(ids, (id: string) => deleteRecurringAdjustment(id, user));
}
