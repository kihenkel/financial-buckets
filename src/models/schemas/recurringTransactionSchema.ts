import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const recurringTransactionSchemaNew = databaseModelSchema.append({
  bucketId: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.string().isoDate()
    .when('intervalType', { is: 'semiMonthly', then: Joi.required(), otherwise: Joi.optional() }),
  interval: Joi.number().positive()
    .when('intervalType', { is: 'semiMonthly', then: Joi.required(), otherwise: Joi.optional() }),
  intervalType: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly', 'semiMonthly').required(),
  transactionsLeft: Joi.number().positive().allow(-1, 0).required(),
  description: Joi.string(),
});

export const recurringTransactionSchemaUpdate = recurringTransactionSchemaNew.keys({
  bucketId: Joi.string(),
  amount: Joi.number(),
  date: Joi.string().isoDate(),
  interval: Joi.number().positive(),
  intervalType: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly', 'semiMonthly'),
  transactionsLeft: Joi.number().positive().allow(-1, 0),
});

export const recurringTransactionOptimizeKeys = ['userId', 'bucketId'];