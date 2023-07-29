import Joi from 'joi';
import { databaseModelNew, databaseModelSchemaUpdate } from './databaseModelSchema';

export const intervalModelSchemaNew = databaseModelNew.append({
  intervalType: Joi.string()
    .valid('daily', 'weekly', 'semiMonthly', 'monthly', 'yearly').required(),
  interval: Joi.number().positive()
    .when('intervalType', { is: 'semiMonthly', then: Joi.optional(), otherwise: Joi.required() }),
  initialDate: Joi.string().isoDate()
    .when('intervalType', { is: 'semiMonthly', then: Joi.optional(), otherwise: Joi.required() }),
  isLimited: Joi.boolean().required(),
  amountLeft: Joi.when('isLimited', { is: true, then: Joi.number().positive().required(), otherwise: Joi.number().positive().optional() }),
  counter: Joi.number().min(0).required(),
});

export const intervalModelSchemaUpdate = databaseModelSchemaUpdate.append({
  intervalType: Joi.string().valid('daily', 'weekly', 'semiMonthly', 'monthly', 'yearly'),
  interval: Joi.number().positive(),
  initialDate: Joi.string().isoDate(),
  isLimited: Joi.boolean(),
  amountLeft: Joi.when('isLimited', { is: true, then: Joi.number().positive(), otherwise: Joi.number().positive().optional() }),
  counter: Joi.number().min(0),
});
