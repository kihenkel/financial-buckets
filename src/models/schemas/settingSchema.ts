import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const settingSchemaNew = databaseModelNew.append({
  shouldAutosave: Joi.boolean().required(),
  autosaveInterval: Joi.number().positive().valid(0).required(),
});

export const settingSchemaUpdate = databaseModelSchemaUpdate.append({
  shouldAutosave: Joi.boolean(),
  autosaveInterval: Joi.number().positive().valid(0),
});

export const settingOptimizeKeys = ['userId'];