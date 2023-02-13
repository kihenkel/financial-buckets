import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const balanceSchemaNew = databaseModelSchema.append({
  accountId: Joi.string().required(),
  amount: Joi.number().required(),
});

export const balanceSchemaUpdate = balanceSchemaNew.keys({
  accountId: Joi.string(),
  amount: Joi.number(),
});

export const balanceOptimizeKeys = ['userId', 'accountId'];