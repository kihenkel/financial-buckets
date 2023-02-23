import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const adjustmentSchemaNew = databaseModelNew.append({
  accountId: Joi.string().required(),
  amount: Joi.number().required(),
  label: Joi.string().required(),
  date: Joi.string().isoDate().required(),
  description: Joi.string(),
  validUntilTimestamp: Joi.number().positive(),
  recurringAdjustmentId: Joi.string(),
});

export const adjustmentSchemaUpdate = databaseModelSchemaUpdate.append({
  accountId: Joi.string(),
  amount: Joi.number(),
  label: Joi.string(),
  date: Joi.string().isoDate(),
  description: Joi.string(),
  validUntilTimestamp: Joi.number().positive(),
  recurringAdjustmentId: Joi.string(),
});

export const adjustmentOptimizeKeys = ['userId', 'accountId'];