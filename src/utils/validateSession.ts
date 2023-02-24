import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

interface SessionValidationResult {
  success: boolean;
  status: number;
  data?: any;
  session?: Session;
}

export const validateSession = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<SessionValidationResult> => {
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
