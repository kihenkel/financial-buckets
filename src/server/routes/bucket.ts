import db from '@/server/db';
import { User, Bucket, Account } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';

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

export async function deleteBuckets(ids: string[], user: User): Promise<void> {
  logger.info(`Deleting ${ids.length} buckets ...`);

  // Not deleting transactions for buckets for now, to preserve data
  // await chainPromises(ids, (id: string) => deleteTransactionsByBucket(id, user));

  const query = new Query().findByIds(ids).findBy('userId', user.id);
  return db.deleteBuckets(query);
}
