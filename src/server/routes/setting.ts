import db from '@/server/db';
import { User, Setting } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';

export async function getSettings(user: User): Promise<Setting[]> {
  const query = new Query<Setting>().findBy('userId', user.id);
  let settings = await db.getAllSettings(query);
  if (!settings.length) {
    await db.addSetting({
      userId: user.id,
      shouldAutosave: true,
      autosaveInterval: 0,
    });
    settings = await db.getAllSettings(query);
  }
  return settings;
}

async function updateSetting(newSetting: Partial<Setting>, user: User): Promise<Setting> {
  if (!newSetting.id) {
    throw new Error('Failed to update: Missing setting id!');
  }
  logger.info(`Updating setting ${newSetting.id} ...`);
  const query = new Query<Setting>().findById(newSetting.id).findBy('userId', user.id);
  const updatedSetting = await db.updateSetting(query, newSetting);
  if (!updatedSetting) {
    logger.warning(`Could not find and update setting with id ${newSetting.id} and userId ${user.id}!`);
  }
  return updatedSetting;
}

export async function addSetting(newSetting: Partial<Setting>, user: User): Promise<Setting> {
  logger.info(`Adding new setting for user ${user.id} ...`);
  if (newSetting.userId !== user.id) {
    throw new Error(`User id from setting ${newSetting.userId} and signed in user ${user.id} dont match. Aborting setting creation!`);
  }
  return db.addSetting(newSetting);
}

async function updateOrAddSetting(newSetting: Partial<Setting>, user: User): Promise<Setting> {
  if (newSetting.id) {
    return updateSetting(newSetting, user);
  } else {
    return addSetting(newSetting, user);
  }
}

export async function updateSettings(newSettings: Partial<Setting>[], user: User): Promise<Setting[]> {
  if (!newSettings.length) {
    return [];
  }
  logger.info(`Updating ${newSettings.length} settings ...`);

  const updatedSettings = await chainPromises(newSettings, (setting: Partial<Setting>) => updateOrAddSetting(setting, user));
  return updatedSettings;
}
