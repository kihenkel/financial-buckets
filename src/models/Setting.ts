import { DatabaseModel } from './DatabaseModel';

export const settingDisplayName = 'Setting';

export interface Setting extends DatabaseModel {
  shouldAutosave: boolean;
  autosaveInterval: number;
}
