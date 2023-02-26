import Joi from 'joi';
import logger from '@/server/logger';

type Handler = () => Promise<any>;

const validate = (schema: Joi.Schema, data: any): string => {
  const validationResult = schema.validate(data);
  if (validationResult.error) {
    const message = `Schema validation failed: ${validationResult.error.message}`;
    logger.error(message);
    return message;
  }
  return '';
};

export const withValidatedSchema = (schema: Joi.Schema, data: any | any[], handler: Handler): Promise<any> => {
  if (Array.isArray(data)) {
    const errorMessages = data.map((entry) => validate(schema, entry)).filter(value => value);
    if (errorMessages.length > 0) {
      return Promise.reject(`ERROR: ${errorMessages.length} out of ${data.length} validations failed.`);
    }
  } else {
    const errorMessage = validate(schema, data);
    if (errorMessage) {
      return Promise.reject(errorMessage);
    }
  }
  return handler();
};
