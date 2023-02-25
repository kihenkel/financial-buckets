import { DatabaseModel } from './DatabaseModel';

export const settingsDisplayName = 'Settings';

export interface Settings extends DatabaseModel {
  shouldAutosave: boolean;
  autosaveInterval: number;
}
