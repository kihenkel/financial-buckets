import { Adjustment } from '@/models';
import db from '@/server/db';
import { createService, ServiceHandlers } from './createService';

const serviceHandlers: ServiceHandlers<Adjustment> = {
  get: db.getAdjustment,
  getAll: db.getAllAdjustments,
  add: db.addAdjustment,
  addAll: db.addAdjustments,
  update: db.updateAdjustment,
  updateAll: db.updateAdjustments,
  deleteAll: db.deleteAdjustments,
};

export const adjustmentService = {
  ...createService('adjustment', serviceHandlers),
};
