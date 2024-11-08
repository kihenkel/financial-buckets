import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const accountSchemaNew = databaseModelNew.append({
  name: Joi.string(),
  cycle: Joi.string().valid('weekly', 'biweekly', 'semimonthly', 'monthly'),
  balance: Joi.number().required(),
  initialBalance: Joi.number().required(),
  lastAccess: Joi.string().isoDate(),
  type: Joi.string().valid('checking', 'savings', 'cd').required(),
  interestRate: Joi.number(),
  openDate: Joi.string().isoDate(),
  maturityDate: Joi.string().isoDate(),
});

export const accountSchemaUpdate = databaseModelSchemaUpdate.append({
  name: Joi.string(),
  cycle: Joi.string().valid('weekly', 'biweekly', 'semimonthly', 'monthly'),
  balance: Joi.number(),
  // Intentionally not allowing initialBalance to change, since it's supposed to be set only once
  // initialBalance: Joi.number(),
  lastAccess: Joi.string().isoDate(),
  type: Joi.string().valid('checking', 'savings', 'cd'),
  interestRate: Joi.number(),
  openDate: Joi.string().isoDate(),
  maturityDate: Joi.string().isoDate(),
});

export const accountOptimizeKeys = ['userId'];