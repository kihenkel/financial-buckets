import { DatabaseModel } from './DatabaseModel';

export const userDisplayName = 'User';

export interface UserAuthModel {
  auth0Id: string;
}

export type DatabaseModelNoUserId = Omit<DatabaseModel, 'userId'>;

export interface User extends DatabaseModelNoUserId, UserAuthModel {
  name: string;
}
