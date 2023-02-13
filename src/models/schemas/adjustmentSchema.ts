import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const adjustmentSchemaNew = databaseModelSchema.append({
  accountId: Joi.string().required(),
  amount: Joi.number().required(),
  label: Joi.string().required(),
  description: Joi.string(),
  validUntilTimestamp: Joi.number().positive(),
  recurringAdjustmentId: Joi.string(),
});

export const adjustmentSchemaUpdate = adjustmentSchemaNew.keys({
  accountId: Joi.string(),
  amount: Joi.number(),
  label: Joi.string(),
});

export const adjustmentOptimizeKeys = ['userId', 'accountId'];