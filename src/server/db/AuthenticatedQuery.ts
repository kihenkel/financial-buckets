import { DatabaseModel, User } from '@/models';
import { Query } from './Query';

export class AuthenticatedQuery<T = DatabaseModel> extends Query<T> {
  constructor(user: User) {
    super();
    this.fields = {
      // Prefilling userId in query to ensure logged in user can only fetch its own data
      userId: user.id,
    };
  }
}
