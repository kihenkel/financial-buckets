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
    const data = await fetchData(validationResult.session, accountId);
    res.status(200).json(data);
    return;
  } else if (req.method === 'PUT') {
    const data = await updateData(validationResult.session, req.body);
    res.status(200).json(data);
    return;
  } else if (req.method === 'DELETE') {
    await deleteData(validationResult.session, req.body);
    res.status(200).end();
    return;
  }

  res.status(405).end();
}
