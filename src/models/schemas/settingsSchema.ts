import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const settingsSchemaNew = databaseModelNew.append({
  shouldAutosave: Joi.boolean().required(),
});

export const settingsSchemaUpdate = databaseModelSchemaUpdate.append({
  shouldAutosave: Joi.boolean(),
});

export const settingsOptimizeKeys = ['userId'];