import type { NextApiRequest, NextApiResponse } from 'next';
import { optimize, optimizeAll } from '@/server/routes';
import { validateSession } from '@/utils/validateSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const validationResult = await validateSession(req, res);
  if (!validationResult.success || !validationResult.session) {
    res.status(validationResult.status).json(validationResult.data);
    return;
  }

  if (req.method === 'POST') {
    const bucketId = req.query.bucketId && String(req.query.bucketId);
    const accountId = req.query.accountId && String(req.query.accountId);
    const maxTransactions = Number.parseInt(String(req.query.maxTransactions)) || 5;
    if ((bucketId && accountId) || (!bucketId && !accountId)) {
      res.status(400).end();
      return;
    }
    const data = bucketId ?
      await optimize(validationResult.session, bucketId, maxTransactions) :
      await optimizeAll(validationResult.session, accountId ?? '', maxTransactions);
    res.status(200).json(data);
    return;
  }

  res.status(405).end();
}
