import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const accountSchemaNew = databaseModelSchema.append({
  name: Joi.string(),
  cycle: Joi.string().valid('weekly', 'biweekly', 'semimonthly', 'monthly'),
  balance: Joi.number().required(),
});

export const accountSchemaUpdate = accountSchemaNew.keys({
  userId: Joi.string(),
  balance: Joi.number(),
});

export const accountOptimizeKeys = ['userId'];