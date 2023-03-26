import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const bucketSchemaNew = databaseModelNew.append({
  accountId: Joi.string().required(),
  name: Joi.string(),
  target: Joi.number(),
});

export const bucketSchemaUpdate = databaseModelSchemaUpdate.append({
  accountId: Joi.string(),
  name: Joi.string(),
  target: Joi.number(),
});

export const bucketOptimizeKeys = ['userId', 'accountId'];