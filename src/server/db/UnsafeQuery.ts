import { DatabaseModel } from '@/models';
import { Query } from './Query';

/* Explicitly calling this query "unsafe" to emphasize that it's not checking for the userId */
export class UnsafeQuery<T = DatabaseModel> extends Query<T> {
}
