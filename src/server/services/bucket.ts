import { Bucket } from '@/models';
import db from '@/server/db';
import { createService, ServiceHandlers } from './createService';

const serviceHandlers: ServiceHandlers<Bucket> = {
  get: db.getBucket,
  getAll: db.getAllBuckets,
  add: db.addBucket,
  addAll: db.addBuckets,
  update: db.updateBucket,
  updateAll: db.updateBuckets,
  deleteAll: db.deleteBuckets,
};

export const bucketService = {
  ...createService('bucket', serviceHandlers),
};
