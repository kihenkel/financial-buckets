import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const settingsSchemaNew = databaseModelNew.append({
  shouldAutosave: Joi.boolean().required(),
  autosaveInterval: Joi.number().min(0).required(),
});

export const settingsSchemaUpdate = databaseModelSchemaUpdate.append({
  shouldAutosave: Joi.boolean(),
  autosaveInterval: Joi.number().min(0),
});

export const settingsOptimizeKeys = ['userId'];