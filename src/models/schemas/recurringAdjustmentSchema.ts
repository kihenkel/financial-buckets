import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const recurringAdjustmentSchemaNew = databaseModelSchema.append({
  accountId: Joi.string().required(),
  amount: Joi.number().required(),
  dayOfMonth: Joi.number().min(1).max(31).required(),
  label: Joi.string().required(),
  description: Joi.string(),
});

export const recurringAdjustmentSchemaUpdate = recurringAdjustmentSchemaNew.keys({
  accountId: Joi.string(),
  amount: Joi.number(),
  dayOfMonth: Joi.number().min(1).max(31),
  label: Joi.string(),
});

export const recurringAdjustmentOptimizeKeys = ['userId', 'accountId'];