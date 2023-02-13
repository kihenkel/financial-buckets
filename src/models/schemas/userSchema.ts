import Joi from 'joi';

export const userSchemaUpdate = Joi.object({
  id: Joi.string(),
  created: Joi.string(),
  modified: Joi.string(),
  
  name: Joi.string(),
  auth0Id: Joi.string(),
});

export const userSchemaNew = userSchemaUpdate.or('auth0Id');

export const userOptimizeKeys = ['auth0Id'];