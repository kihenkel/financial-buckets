import Joi from 'joi';
import { databaseModelSchema } from './databaseModelSchema';

export const intervalModelSchemaNew = databaseModelSchema.append({
  intervalType: Joi.string()
    .valid('daily', 'weekly', 'semiMonthly', 'monthly', 'yearly').required(),
  interval: Joi.number().positive()
    .when('intervalType', { is: 'semiMonthly', then: Joi.optional(), otherwise: Joi.required() }),
  initialDate: Joi.string().isoDate()
    .when('intervalType', { is: 'semiMonthly', then: Joi.optional(), otherwise: Joi.required() }),
  isLimited: Joi.boolean().required(),
  amountLeft: Joi.number().positive()
    .when('isLimited', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  lastRun: Joi.string().isoDate(),
});

export const intervalModelSchemaUpdate = intervalModelSchemaNew.keys({
  intervalType: Joi.string().valid('daily', 'weekly', 'semiMonthly', 'monthly', 'yearly'),
  interval: Joi.number().positive(),
  initialDate: Joi.string().isoDate(),
  isLimited: Joi.boolean(),
  amountLeft: Joi.number().positive(),
});
