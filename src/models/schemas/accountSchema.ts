import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const accountSchemaNew = databaseModelNew.append({
  name: Joi.string(),
  cycle: Joi.string().valid('weekly', 'biweekly', 'semimonthly', 'monthly'),
  balance: Joi.number().required(),
  lastAccess: Joi.string().isoDate(),
});

export const accountSchemaUpdate = databaseModelSchemaUpdate.append({
  name: Joi.string(),
  cycle: Joi.string().valid('weekly', 'biweekly', 'semimonthly', 'monthly'),
  balance: Joi.number(),
  lastAccess: Joi.string().isoDate(),
});

export const accountOptimizeKeys = ['userId'];