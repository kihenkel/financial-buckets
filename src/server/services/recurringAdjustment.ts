import { Account, Adjustment, RecurringAdjustment, User } from '@/models';
import db from '@/server/db';
import { getActiveAdjustmentDates } from '@/utils/getActiveAdjustmentDates';
import logger from '../logger';
import { adjustmentService } from './adjustment';
import { createService, ServiceHandlers } from './createService';

const serviceHandlers: ServiceHandlers<RecurringAdjustment> = {
  get: db.getRecurringAdjustment,
  getAll: db.getAllRecurringAdjustments,
  add: db.addRecurringAdjustment,
  addAll: db.addRecurringAdjustments,
  update: db.updateRecurringAdjustment,
  updateAll: db.updateRecurringAdjustments,
  deleteAll: db.deleteRecurringAdjustments,
};

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

interface AdjustmentSyncResult {
  adjustments: Adjustment[];
  created: number;
  removed: number;
}

const syncAdjustments = async (existingAdjustments: Adjustment[], recurringAdjustments: RecurringAdjustment[], account: Account, user: User): Promise<AdjustmentSyncResult> => {
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

  await adjustmentService.deleteAll(obsoleteAdjustments.map((obsoleteAdjustment) => obsoleteAdjustment.id), user);
  const addedAdjustments: Adjustment[] = (await adjustmentService.updateOrAdd(newAdjustments, user))
    .map(adjustment => ({ ...adjustment, isNew: true }));

  return {
    adjustments: [...allManualAdjustments, ...validAdjustments, ...addedAdjustments],
    created: addedAdjustments.length,
    removed: obsoleteAdjustments.length,
  };
};

export const recurringAdjustmentService = {
  ...createService('recurringAdjustment', serviceHandlers),
  syncAdjustments,
};
