import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const transactionSchemaNew = databaseModelSchema.append({
  bucketId: Joi.string().required(),
  amount: Joi.number().required(),
  timestamp: Joi.number().positive().required(),
  description: Joi.string(),
  recurringTransactionId: Joi.string(),
});

export const transactionSchemaUpdate = transactionSchemaNew.keys({
  bucketId: Joi.string(),
  amount: Joi.number(),
  timestamp: Joi.number().positive(),
});

export const transactionOptimizeKeys = ['userId'];