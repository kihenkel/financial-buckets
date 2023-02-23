import db from '@/server/db';
import { User, Adjustment, Account } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';

export function getAdjustments(user: User, account: Account): Promise<Adjustment[]> {
  const query = new Query<Adjustment>().findBy('userId', user.id).findBy('accountId', account.id);
  return db.getAllAdjustments(query);
}

async function updateAdjustment(newAdjustment: Partial<Adjustment>, user: User): Promise<Adjustment> {
  if (!newAdjustment.id) {
    throw new Error('Failed to update: Missing adjustment id!');
  }
  logger.info(`Updating adjustment ${newAdjustment.id} ...`);
  const query = new Query().findById(newAdjustment.id).findBy('userId', user.id);
  const updatedAdjustment = await db.updateAdjustment(query, newAdjustment);
  if (!updatedAdjustment) {
    logger.warning(`Could not find and update adjustment with id ${newAdjustment.id} and userId ${user.id}!`);
  }
  return updatedAdjustment;
}

async function addAdjustment(newAdjustment: Partial<Adjustment>, user: User): Promise<Adjustment> {
  logger.info(`Adding new adjustment for user ${user.id} ...`);
  if (newAdjustment.userId !== user.id) {
    throw new Error(`User id from adjustment ${newAdjustment.userId} and signed in user ${user.id} dont match. Aborting adjustment creation!`);
  }
  return db.addAdjustment(newAdjustment);
}

async function updateOrAddAdjustment(newAdjustment: Partial<Adjustment>, user: User): Promise<Adjustment> {
  if (newAdjustment.id) {
    return updateAdjustment(newAdjustment, user);
  } else {
    return addAdjustment(newAdjustment, user);
  }
}

export async function updateAdjustments(newAdjustments: Partial<Adjustment>[], user: User): Promise<Adjustment[]> {
  if (!newAdjustments.length) {
    return [];
  }
  logger.info(`Updating ${newAdjustments.length} adjustments ...`);

  const updatedAdjustments = await chainPromises(newAdjustments, (adjustment: Partial<Adjustment>) => updateOrAddAdjustment(adjustment, user));
  return updatedAdjustments;
}

export async function deleteAdjustments(ids: string[], user: User): Promise<void> {
  if (!ids.length) {
    return;
  }
  logger.info(`Deleting ${ids.length} adjustments ...`);
  const query = new Query().findByIds(ids).findBy('userId', user.id);
  return db.deleteAdjustments(query);
}
