import type { NextApiRequest, NextApiResponse } from 'next';
import { importData } from '@/server/routes';
import { validateSession } from '@/utils/validateSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const validationResult = await validateSession(req, res);
  if (!validationResult.success || !validationResult.session) {
    res.status(validationResult.status).json(validationResult.data);
    return;
  }

  if (req.method === 'POST') {
    const data = await importData(validationResult.session, req.body);
    res.status(200).json(data);
    return;
  }

  res.status(405).end();
}
