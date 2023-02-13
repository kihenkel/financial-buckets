import db from '@/server/db';
import { User, Bucket, Account } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';
import { deleteTransactionsByBucket } from './transaction';

export function getBuckets(user: User, account: Account): Promise<Bucket[]> {
  const query = new Query<Bucket>().findBy('userId', user.id).findBy('accountId', account.id);
  return db.getAllBuckets(query);
}

async function updateBucket(newBucket: Partial<Bucket>, user: User): Promise<Bucket> {
  if (!newBucket.id) {
    throw new Error('Failed to update: Missing bucket id!');
  }
  logger.info(`Updating bucket ${newBucket.id} ...`);
  const query = new Query().findById(newBucket.id).findBy('userId', user.id);
  const updatedBucket = await db.updateBucket(query, newBucket);
  if (!updatedBucket) {
    logger.warning(`Could not find and update bucket with id ${newBucket.id} and userId ${user.id}!`);
  }
  return updatedBucket;
}

async function addBucket(newBucket: Partial<Bucket>, user: User): Promise<Bucket> {
  logger.info(`Adding new bucket for user ${user.id} ...`);
  if (newBucket.userId !== user.id) {
    throw new Error(`User id from bucket ${newBucket.userId} and signed in user ${user.id} dont match. Aborting bucket creation!`);
  }
  return db.addBucket(newBucket);
}

async function updateOrAddBucket(newBucket: Partial<Bucket>, user: User): Promise<Bucket> {
  if (newBucket.id) {
    return updateBucket(newBucket, user);
  } else {
    return addBucket(newBucket, user);
  }
}

export async function updateBuckets(newBuckets: Partial<Bucket>[], user: User): Promise<Bucket[]> {
  logger.info(`Updating ${newBuckets.length} buckets ...`);

  const updatedBuckets = await chainPromises(newBuckets, (bucket: Partial<Bucket>) => updateOrAddBucket(bucket, user));
  return updatedBuckets;
}

async function deleteBucket(id: string, user: User): Promise<void> {
  logger.info(`Deleting bucket ${id} ...`);
  await deleteTransactionsByBucket(id, user);
  const query = new Query().findById(id).findBy('userId', user.id);
  return db.deleteBuckets(query);
}

export async function deleteBuckets(ids: string[], user: User): Promise<void> {
  logger.info(`Deleting ${ids.length} buckets ...`);

  await chainPromises(ids, (id: string) => deleteBucket(id, user));
}
