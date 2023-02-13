import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const bucketSchemaNew = databaseModelSchema.append({
  accountId: Joi.string().required(),
  name: Joi.string(),
});

export const bucketSchemaUpdate = bucketSchemaNew.keys({
  accountId: Joi.string(),
});

export const bucketOptimizeKeys = ['userId', 'accountId'];