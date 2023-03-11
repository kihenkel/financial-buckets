import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/server/db';
import logger from '@/server/logger';

const MAX_PREFETCH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let lastPrefetch: number | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'GET') {
    const now = Date.now();
    if (lastPrefetch && now - lastPrefetch <= MAX_PREFETCH_INTERVAL_MS) {
      logger.warning('Too many prefetches! Rejecting ...');
      res.status(403).end();
      return;
    }
    lastPrefetch = now;
    logger.info('Prefetching ...');
    if (!db.isConnected()) {
      await db.connect();
    }
    res.status(200).end();
    return;
  }

  res.status(405).end();
}
