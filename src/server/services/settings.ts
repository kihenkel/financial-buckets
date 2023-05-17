import db from '@/server/db';
import { User, Settings } from '@/models';
import { Query } from '@/server/db/Query';
import { createService, ServiceHandlers } from './createService';
import logger from '../logger';

// Multiple settings not supported
const serviceHandlers: ServiceHandlers<Settings> = {
  get: db.getSettings,
  getAll: () => Promise.resolve([]),
  add: db.addSettings,
  addAll: () => Promise.resolve([]),
  update: db.updateSettings,
  updateAll: () => Promise.resolve([]),
  deleteAll: db.deleteSettings,
};

const getByUser = async (user: User): Promise<Settings> => {
  logger.info(`Getting settings by user id ${user.id} ...`);
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
};

export const settingsService = {
  ...createService('settings', serviceHandlers),
  getByUser,
  getAll: undefined,
  getAllBy: undefined,
  addAll: undefined,
  updateAll: undefined,
  deleteAll: undefined,
};
