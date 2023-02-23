import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const balanceSchemaNew = databaseModelNew.append({
  accountId: Joi.string().required(),
  amount: Joi.number().required(),
});

export const balanceSchemaUpdate = databaseModelSchemaUpdate.append({
  accountId: Joi.string(),
  amount: Joi.number(),
});

export const balanceOptimizeKeys = ['userId', 'accountId'];