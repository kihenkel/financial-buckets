import { DatabaseModel, User } from '@/models';
import { Query } from '../db/Query';
import logger from '../logger';

export interface ServiceHandlers<T> {
  get(id: string): Promise<T>;
  getAll(query: Query<T>): Promise<T[]>;
  add(data: any): Promise<T>;
  addAll(data: any[]): Promise<T[]>;
  update(query: Query<T>, data: any): Promise<T>;
  updateAll(queries: Query<T>[], dataList: any[]): Promise<T[]>;
  deleteAll(query: Query<T>): Promise<void>;
}

export const createService = <T extends DatabaseModel>(modelName: string, handlers: ServiceHandlers<T>) => {
  const get = (id: string, user: User) => {
    logger.info(`Getting ${modelName} by id ${id} and user ${user.id} ...`);
    return handlers.get(id);
  };

  const getAll = (user: User) => {
    const query = new Query<T>().findBy('userId', user.id);
    return handlers.getAll(query);
  };

  const getAllBy = (refIdName: string, refs: DatabaseModel[] | string[], user: User) => {
    const refIds = refs.map((ref) => typeof ref === 'string' ? ref : ref.id);
    const query = new Query<T>().findBy('userId', user.id).findBy(refIdName as keyof DatabaseModel, refIds);
    return handlers.getAll(query);
  };

  const add = (item: Partial<T>, user: User) => {
    if (item.userId !== user.id) {
      throw new Error(`UserId from ${modelName} ${item.userId} and signed in user ${user.id} do not match. Aborting ${modelName} creation!`);
    }
    logger.info(`Adding new ${modelName} for user ${user.id} ...`);
    return handlers.add(item);
  };

  const addAll = (items: Partial<T>[], user: User) => {
    if (items.some((item) => item.userId !== user.id)) {
      throw new Error(`UserId from at least one of the ${modelName}s does not matched the signed in user ${user.id} do not match. Aborting ${modelName} creation!`);
    }
    logger.info(`Adding ${items.length} new ${modelName}s for user ${user.id} ...`);
    return handlers.addAll(items);
  };

  const update = async (item: Partial<T>, user: User) => {
    if (!item.id) {
      throw new Error(`Failed to update: Missing ${modelName} id!`);
    }
    logger.info(`Updating ${modelName} ${item.id} for user ${user.id} ...`);
    const query = new Query<T>().findById(item.id).findBy('userId', user.id);
    const updatedItem = await handlers.update(query, item);
    if (!updatedItem) {
      logger.warning(`Could not find and update ${modelName} with id ${item.id} and userId ${user.id}!`);
    }
    return updatedItem;
  };

  const updateAll = async (items: Partial<T>[], user: User) => {
    if (items.some((item) => !item.id)) {
      throw new Error(`At least one of the ${modelName}s is missing an id. Aborting ${modelName} update!`);
    }
    logger.info(`Updating ${items.length} ${modelName}s for user ${user.id} ...`);
    const updateQueries = items.map((item) => new Query<T>().findById(item.id ?? '').findBy('userId', user.id));
    return handlers.updateAll(updateQueries, items);
  };

  const deleteAll = async (ids: string[], user: User) => {
    if (!ids.length) {
      return;
    }
    logger.info(`Deleting ${ids.length} ${modelName}s ...`);
    const query = new Query<T>().findByIds(ids).findBy('userId', user.id);
    return handlers.deleteAll(query);
  };

  const updateOrAdd = async (items: Partial<T>[], user: User) => {
    const itemsToCreate: Partial<T>[] = [];
    const itemsToUpdate: Partial<T>[] = [];
    items.forEach((item) => {
      if (item.id) {
        itemsToUpdate.push(item);
      } else {
        itemsToCreate.push(item);
      }
    });

    const returnItems: T[] = [];
    if (itemsToUpdate.length === 1) {
      const updatedItem = await update(itemsToUpdate[0], user);
      returnItems.push(updatedItem);
    } else if (itemsToUpdate.length > 1) {
      const updatedItems = await updateAll(itemsToUpdate, user);
      returnItems.push(...updatedItems);
    }
  
    if (itemsToCreate.length === 1) {
      const createdItem = await add(itemsToCreate[0], user);
      returnItems.push(createdItem);
    } else if (itemsToCreate.length > 1) {
      const createdItems = await addAll(itemsToCreate, user);
      returnItems.push(...createdItems);
    }
    return returnItems;
  };

  return {
    get,
    getAll,
    getAllBy,
    add,
    addAll,
    updateOrAdd,
    deleteAll,
  };
};