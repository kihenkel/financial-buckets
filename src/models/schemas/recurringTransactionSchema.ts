import Joi from 'joi';
import { intervalModelSchemaNew, intervalModelSchemaUpdate } from './intervalModelSchema';

export const recurringTransactionSchemaNew = intervalModelSchemaNew.append({
  bucketId: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string(),
});

export const recurringTransactionSchemaUpdate = intervalModelSchemaUpdate.append({
  bucketId: Joi.string(),
  amount: Joi.number(),
  description: Joi.string(),
});

export const recurringTransactionOptimizeKeys = ['userId', 'bucketId'];