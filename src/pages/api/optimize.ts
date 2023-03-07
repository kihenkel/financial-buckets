import type { NextApiRequest, NextApiResponse } from 'next';
import { optimize } from '@/server/routes';
import { validateSession } from '@/utils/validateSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const validationResult = await validateSession(req, res);
  if (!validationResult.success || !validationResult.session) {
    res.status(validationResult.status).json(validationResult.data);
    return;
  }

  if (req.method === 'POST') {
    if (!req.query.bucketId) {
      res.status(400).end();
      return;
    }
    const bucketId = String(req.query.bucketId);
    const data = await optimize(validationResult.session, bucketId);
    res.status(200).json(data);
    return;
  }

  res.status(405).end();
}
