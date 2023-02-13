import Joi from 'joi';

export const databaseModelSchema = Joi.object({
  id: Joi.string(),
  userId: Joi.string().required(),
  created: Joi.date(),
  modified: Joi.date(),
});
