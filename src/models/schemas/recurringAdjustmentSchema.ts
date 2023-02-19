import Joi from 'joi';
import { intervalModelSchemaNew, intervalModelSchemaUpdate } from './intervalModelSchema';

export const recurringAdjustmentSchemaNew = intervalModelSchemaNew.append({
  accountId: Joi.string().required(),
  amount: Joi.number().required(),
  label: Joi.string().required(),
  description: Joi.string(),
});

export const recurringAdjustmentSchemaUpdate = intervalModelSchemaUpdate.append({
  accountId: Joi.string(),
  amount: Joi.number(),
  label: Joi.string(),
  description: Joi.string(),
});

export const recurringAdjustmentOptimizeKeys = ['userId', 'accountId'];