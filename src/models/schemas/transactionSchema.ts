import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const transactionSchemaNew = databaseModelNew.append({
  bucketId: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.string().isoDate().required(),
  description: Joi.string(),
  recurringTransactionId: Joi.string(),
  mergedTransactionId: Joi.string(),
  isMergedTransaction: Joi.bool(),
});

export const transactionSchemaUpdate = databaseModelSchemaUpdate.append({  
  bucketId: Joi.string(),
  amount: Joi.number(),
  date: Joi.string().isoDate(),
  description: Joi.string(),
  recurringTransactionId: Joi.string(),
  mergedTransactionId: Joi.string(),
  isMergedTransaction: Joi.bool(),
});

export const transactionOptimizeKeys = ['userId', 'mergedTransactionId'];