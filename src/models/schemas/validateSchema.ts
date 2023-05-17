import Joi from 'joi';
import logger from '@/server/logger';

type Handler = (data: any) => Promise<any>;

interface ValidationResult {
  data?: any;
  errorMessage?: string;
}

const validate = (schema: Joi.Schema, data: any): ValidationResult => {
  const validationResult = schema.validate(data);
  if (validationResult.error) {
    const errorMessage = `Schema validation failed: ${validationResult.error.message}`;
    logger.error(errorMessage);
    return { errorMessage };
  }
  return { data: validationResult.value };
};

export const withValidatedSchema = (schema: Joi.Schema, data: any | any[], handler: Handler): Promise<any> => {
  if (Array.isArray(data)) {
    const validationResults = data.map((entry) => validate(schema, entry));
    const failedValidations = validationResults.filter((validationResult) => validationResult.errorMessage);
    if (failedValidations.length > 0) {
      return Promise.reject(`ERROR: ${failedValidations.length} out of ${validationResults.length} validations failed.`);
    }
    return handler(validationResults.map((validationResult) => validationResult.data));
  }

  const validationResult = validate(schema, data);
  if (validationResult.errorMessage) {
    return Promise.reject(validationResult.errorMessage);
  }
  return handler(validationResult.data);
};
