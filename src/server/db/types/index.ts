import { DatabaseModel } from '@/models/DatabaseModel';
import { Query } from '@/server/db/Query';

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean | Promise<boolean>;
  getAll(modelName: string, query?: Query): Promise<any[]>;
  getFirst(modelName: string, query?: Query): Promise<any>;
  get(modelName: string, id: string): Promise<any>;
  add(modelName: string, data: any | any[]): Promise<any>;
  update(modelName: string, query: Query, data: any | any[]): Promise<any>;
  deleteAll(modelName: string, query: Query): Promise<void>;
}