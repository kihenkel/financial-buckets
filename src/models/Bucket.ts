import { DatabaseModel } from './DatabaseModel';

export const bucketDisplayName = 'Bucket';

export interface Bucket extends DatabaseModel {
  name: string;
  accountId: string;
  target: number;
  order: number;
  isArchived: boolean;
}
