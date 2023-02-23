import db from '@/server/db';
import { User, RecurringAdjustment, Account, Adjustment } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';
import { getActiveAdjustmentDates } from '@/utils/getActiveAdjustmentDates';
import { deleteAdjustments, updateAdjustments } from './adjustment';

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
  const query = new Query().findByIds(ids).findBy('userId', user.id);
  return db.deleteRecurringAdjustments(query);
}

const allocateAdjustments = (existingAdjustments: Adjustment[], recurringAdjustment: RecurringAdjustment, account: Account, user: User) => {
  const activeAdjustmentDates = getActiveAdjustmentDates(recurringAdjustment, account);
  if (!activeAdjustmentDates) {
    logger.error(`Active adjustment dates is null for recurringAdjustment ${recurringAdjustment.id}`);
    return [existingAdjustments, [], []] as const;
  }

  const validAdjustments: Adjustment[] = [];
  const obsoleteAdjustments: Adjustment[] = [];
  existingAdjustments.forEach((existingAdjustment) => {
    const isValidAdjustment = activeAdjustmentDates.some((date) => existingAdjustment.date === date);
    if (isValidAdjustment) {
      validAdjustments.push(existingAdjustment);
    } else {
      obsoleteAdjustments.push(existingAdjustment);
    }
  });
  const newAdjustments: Partial<Adjustment>[] = activeAdjustmentDates
    .filter((date) => !validAdjustments.some((validAdjustment) => validAdjustment.date === date))
    .map((date) => ({
      userId: user.id,
      accountId: account.id,
      amount: recurringAdjustment.amount,
      date,
      label: recurringAdjustment.label,
      description: recurringAdjustment.description,
      recurringAdjustmentId: recurringAdjustment.id,
    }));
  return [validAdjustments, newAdjustments, obsoleteAdjustments] as const;
};

export async function syncAdjustments(existingAdjustments: Adjustment[], recurringAdjustments: RecurringAdjustment[], account: Account, user: User): Promise<Adjustment[]> {
  const [allManualAdjustments, allAutoAdjustments] = existingAdjustments.reduce((currentList: Adjustment[][], existingAdjustment) => {
    if (existingAdjustment.recurringAdjustmentId) {
      currentList[1].push(existingAdjustment);
    } else {
      currentList[0].push(existingAdjustment);
    }
    return currentList;
  }, [[], []]);
  const validAdjustments: Adjustment[] = [];
  const newAdjustments: Partial<Adjustment>[] = [];
  const obsoleteAdjustments: Adjustment[] = [];
  recurringAdjustments.forEach((recurringAdjustment) => {
    const autoAdjustments = allAutoAdjustments.filter((autoAdjustment) => autoAdjustment.recurringAdjustmentId === recurringAdjustment.id);
    const [currentValidAdjustments, currentNewAdjustments, currentObsoleteAdjustments] = allocateAdjustments(autoAdjustments, recurringAdjustment, account, user);
    validAdjustments.push(...currentValidAdjustments);
    newAdjustments.push(...currentNewAdjustments);
    obsoleteAdjustments.push(...currentObsoleteAdjustments);
  });

  await deleteAdjustments(obsoleteAdjustments.map((obsoleteAdjustment) => obsoleteAdjustment.id), user);
  const addedAdjustments: Adjustment[] = (await updateAdjustments(newAdjustments, user))
    .map(adjustment => ({ ...adjustment, isNew: true }));

  return [...allManualAdjustments, ...validAdjustments, ...addedAdjustments];
}
