import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteData, fetchData, updateData } from '@/server/routes';
import { validateSession } from '@/utils/validateSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const validationResult = await validateSession(req, res);
  if (!validationResult.success || !validationResult.session) {
    res.status(validationResult.status).json(validationResult.data);
    return;
  }

  if (req.method === 'GET') {
    const accountId = Array.isArray(req.query.accountId) ? req.query.accountId[0] : req.query.accountId;
    const result = await fetchData(validationResult.session, accountId);
    res.status(result.status).json(result.data);
    return;
  } else if (req.method === 'PUT') {
    const result = await updateData(validationResult.session, req.body);
    res.status(result.status).json(result.data);
    return;
  } else if (req.method === 'DELETE') {
    const result = await deleteData(validationResult.session, req.body);
    res.status(result.status).end();
    return;
  }

  res.status(405).end();
}
