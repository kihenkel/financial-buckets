import db from '@/server/db';
import { User, Settings } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';

export async function getSettings(user: User): Promise<Settings> {
  const query = new Query<Settings>().findBy('userId', user.id);
  let settings = await db.getFirstSettings(query);
  if (!settings) {
    await db.addSettings({
      userId: user.id,
      shouldAutosave: true,
    });
    settings = await db.getFirstSettings(query);
  }
  return settings;
}

async function updatesettings(newSetting: Partial<Settings>, user: User): Promise<Settings> {
  if (!newSetting.id) {
    throw new Error('Failed to update: Missing setting id!');
  }
  logger.info(`Updating setting ${newSetting.id} ...`);
  const query = new Query<Settings>().findById(newSetting.id).findBy('userId', user.id);
  const updatedSetting = await db.updateSettings(query, newSetting);
  if (!updatedSetting) {
    logger.warning(`Could not find and update setting with id ${newSetting.id} and userId ${user.id}!`);
  }
  return updatedSetting;
}

export async function addSettings(newSetting: Partial<Settings>, user: User): Promise<Settings> {
  logger.info(`Adding new setting for user ${user.id} ...`);
  if (newSetting.userId !== user.id) {
    throw new Error(`User id from setting ${newSetting.userId} and signed in user ${user.id} dont match. Aborting setting creation!`);
  }
  return db.addSettings(newSetting);
}

export async function updateSettings(newSettings: Partial<Settings>, user: User): Promise<Settings> {
  if (newSettings.id) {
    return updatesettings(newSettings, user);
  } else {
    return addSettings(newSettings, user);
  }
}
