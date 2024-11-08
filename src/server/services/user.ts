import { Session } from 'next-auth';
import db from '@/server/db';
import { User, UserAuthModel } from '@/models';
import logger from '../logger';
import { UnsafeQuery } from '../db/UnsafeQuery';

const PROVIDERS = ['auth0'];

export async function getFromSession(session: Session): Promise<User> {
  if (!session.user) {
    throw new Error('No session user found!');
  }
  const [providerKey, userId] = session.user.id.split('|');
  const provider = PROVIDERS.find((p) => p === providerKey);
  if (!provider) {
    throw new Error(`Provider '${provider}' not found (in user id ${session.user.id})!`);
  }

  const providerField = `${provider}Id` as keyof UserAuthModel;
  const query = new UnsafeQuery<User>().findBy(providerField, userId);
  let user = await db.getFirstUser(query);

  if (!user) {
    logger.info(`No user ${userId} found for provider ${providerField}, creating new one ...`);
    await db.addUser({ [providerField]: userId });
    user = await db.getFirstUser(query);
  }

  return user;
}

export async function update(user: Partial<User>, sessionUser: User): Promise<User> {
  logger.info(`Updating user ${sessionUser.id} ...`);
  if (user.id !== sessionUser.id) {
    throw new Error(`User id ${user.id} and signed in user ${sessionUser.id} dont match. Aborting!`);
  }
  const updateQuery = new UnsafeQuery<User>().findById(sessionUser.id);
  const updatedUser = await db.updateUser(updateQuery, user);

  return updatedUser;
}

export const userService = {
  getFromSession,
  update,
};
