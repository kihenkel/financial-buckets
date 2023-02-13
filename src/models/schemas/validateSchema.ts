import Joi from 'joi';
import logger from '@/server/logger';

type Handler = () => Promise<any>;

export const withValidatedSchema = (schema: Joi.Schema, data: any, handler: Handler): Promise<any> => {
  const validationResult = schema.validate(data);
  if (validationResult.error) {
    const message = `Schema validation failed: ${validationResult.error.message}`;
    logger.error(message);
    return Promise.reject(message);
  }
  return handler();
};
