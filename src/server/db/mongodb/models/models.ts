import mongoose from 'mongoose';
import { defaultOptions } from './defaults';
import {
  userDisplayName,
  accountDisplayName,
  bucketDisplayName,
  transactionDisplayName,
  recurringTransactionDisplayName,
  balanceDisplayName,
  adjustmentDisplayName,
  recurringAdjustmentDisplayName,
  settingsDisplayName,
} from '@/models';
import {
  userSchemaNew, userOptimizeKeys,
  accountSchemaNew, accountOptimizeKeys,
  bucketSchemaNew, bucketOptimizeKeys,
  transactionSchemaNew, transactionOptimizeKeys,
  recurringTransactionSchemaNew, recurringTransactionOptimizeKeys,
  balanceSchemaNew, balanceOptimizeKeys,
  adjustmentSchemaNew, adjustmentOptimizeKeys,
  recurringAdjustmentSchemaNew, recurringAdjustmentOptimizeKeys,
  settingsSchemaNew, settingsOptimizeKeys,
} from '@/models/schemas';
import { convert } from './joiToMongooseSchema';

const createModel = (name: string, schema: mongoose.Schema<any>) => {
  return mongoose.models[name] || mongoose.model(name, schema);
};

const userMongooseSchema = new mongoose.Schema(convert(userSchemaNew, userOptimizeKeys), { ...defaultOptions });
const accountMongooseSchema = new mongoose.Schema(convert(accountSchemaNew, accountOptimizeKeys), { ...defaultOptions });
const bucketMongooseSchema = new mongoose.Schema(convert(bucketSchemaNew, bucketOptimizeKeys), { ...defaultOptions });
const transactionMongooseSchema = new mongoose.Schema(convert(transactionSchemaNew, transactionOptimizeKeys), { ...defaultOptions });
const recurringTransactionMongooseSchema = new mongoose.Schema(convert(recurringTransactionSchemaNew, recurringTransactionOptimizeKeys), { ...defaultOptions });
const balanceMongooseSchema = new mongoose.Schema(convert(balanceSchemaNew, balanceOptimizeKeys), { ...defaultOptions });
const adjustmentMongooseSchema = new mongoose.Schema(convert(adjustmentSchemaNew, adjustmentOptimizeKeys), { ...defaultOptions });
const recurringAdjustmentMongooseSchema = new mongoose.Schema(convert(recurringAdjustmentSchemaNew, recurringAdjustmentOptimizeKeys), { ...defaultOptions });
const settingMongooseSchema = new mongoose.Schema(convert(settingsSchemaNew, settingsOptimizeKeys), { ...defaultOptions });

const models: Record<string, mongoose.Model<any>> = {
  [userDisplayName]: createModel(userDisplayName, userMongooseSchema),
  [accountDisplayName]: createModel(accountDisplayName, accountMongooseSchema),
  [bucketDisplayName]: createModel(bucketDisplayName, bucketMongooseSchema),
  [transactionDisplayName]: createModel(transactionDisplayName, transactionMongooseSchema),
  [recurringTransactionDisplayName]: createModel(recurringTransactionDisplayName, recurringTransactionMongooseSchema),
  [balanceDisplayName]: createModel(balanceDisplayName, balanceMongooseSchema),
  [adjustmentDisplayName]: createModel(adjustmentDisplayName, adjustmentMongooseSchema),
  [recurringAdjustmentDisplayName]: createModel(recurringAdjustmentDisplayName, recurringAdjustmentMongooseSchema),
  [settingsDisplayName]: createModel(settingsDisplayName, settingMongooseSchema),
};

export default models;
