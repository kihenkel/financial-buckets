import Joi from 'joi';
import { SchemaDefinition, SchemaDefinitionType } from 'mongoose';

interface SchemaFieldSchema {
  type: string;
}

interface SchemaFieldFlags {
  presence: string;
}

interface SchemaField {
  key: string;
  schema: SchemaFieldSchema;
  _flags: SchemaFieldFlags;
}

export const convert = (joiSchema: Joi.AnySchema<any>, optimizeKeys: string[]): SchemaDefinition<SchemaDefinitionType<any>> => {
  const schemaFields = joiSchema['$_terms']['keys'] as SchemaField[];

  const schemaDefinition: SchemaDefinition<SchemaDefinitionType<any>> = schemaFields.reduce((currentDefinition: SchemaDefinition<SchemaDefinitionType<any>>, field: SchemaField) => {
    const value = {
      type: field.schema.type,
      required: field._flags?.presence === 'required',
      index: optimizeKeys.includes(field.key),
    };
    return {
      ...currentDefinition,
      [field.key]: value
    };
  }, {});

  return schemaDefinition;
};