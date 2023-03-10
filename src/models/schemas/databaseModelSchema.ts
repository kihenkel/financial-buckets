import Joi from 'joi';

export const databaseModelNew = Joi.object({
  id: Joi.string(),
  userId: Joi.string().required(),
  created: Joi.date(),
  modified: Joi.date(),
  temporaryId: Joi.string().strip(),
});

export const databaseModelSchemaUpdate = Joi.object({
  id: Joi.string(),
  userId: Joi.string(),
  created: Joi.date(),
  modified: Joi.date(),
  temporaryId: Joi.string().strip(),
});
