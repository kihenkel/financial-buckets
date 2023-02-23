import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { deleteData, fetchData, updateData } from '@/server/routes';

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

interface SessionValidationResult {
  success: boolean;
  status: number;
  data?: any;
  session?: Session;
}

const validateSession = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<SessionValidationResult> => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.id === 'MISSING_ID') {
    return {
      success: false,
      status: 403,
      data: { error: 'You must be signed in to view the protected content on this page.' },
    };
  }
  return {
    success: true,
    status: 200,
    session,
  };
};

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
  } else if (req.method === 'PUT') {
    const data = await updateData(validationResult.session, req.body);
    res.status(200).json(data);
  } else if (req.method === 'DELETE') {
    await deleteData(validationResult.session, req.body);
    res.status(200).end();
  }
}
