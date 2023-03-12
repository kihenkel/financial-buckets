import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/server/db';
import logger from '@/server/logger';

const MAX_PREFETCH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
let lastPrefetch: number | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'GET') {
    const now = Date.now();
    if (lastPrefetch && now - lastPrefetch <= MAX_PREFETCH_INTERVAL_MS) {
      res.status(200).end();
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
