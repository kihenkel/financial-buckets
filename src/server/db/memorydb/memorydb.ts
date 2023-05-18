import { connect, disconnect, isConnected } from './connection';
import { DatabaseAdapter } from '@/server/db/types';
import db from './db';

const dbToDomainModel = (data: any | undefined) => {
  if (!data) {
    return data;
  }
  return data;
};

const domainToDbModel = (data: any) => {
  const dbModel = {
    ...data,
  };
  delete dbModel.id;
  return dbModel;
};

const adapter: DatabaseAdapter = {
  connect,
  disconnect,
  isConnected,
  getAll: async (modelName, query) => {
    const filter = query?.toMemorydbFilterQuery() ?? {};
    const docs = db.find(modelName, filter);
    return docs.map(dbToDomainModel);
  },
  getFirst: async (modelName, query) => {
    const filter = query?.toMemorydbFilterQuery() ?? {};
    const doc = db.findOne(modelName, filter);
    return dbToDomainModel(doc);
  },
  get: async (modelName, id) => {
    const doc = db.findById(modelName, id);
    return dbToDomainModel(doc);
  },
  add: async (modelName, data) => {
    const doc = db.save(modelName, data);
    return dbToDomainModel(doc);
  },
  addAll: async (modelName, dataList) => {
    const docs = dataList.map((entry) => db.save(modelName, entry));
    return docs.map((doc) => dbToDomainModel(doc));
  },
  update: async (modelName, query, data) => {
    const filter = query.toMemorydbFilterQuery();
    const dbModelData = domainToDbModel(data);
    const doc = db.updateOne(modelName, filter, dbModelData);
    return dbToDomainModel(doc);
  },
  updateAll: async (modelName, queries, dataList) => {
    const newDataList = dataList.map((dataEntry, index) => {
      const filter = queries[index].toMemorydbFilterQuery();
      const dbModelData = domainToDbModel(dataEntry);
      return db.updateOne(modelName, filter, dbModelData);
    });
    return newDataList;
  },
  deleteAll: async (modelName, query) => {
    const filter = query.toMemorydbFilterQuery();
    db.deleteMany(modelName, filter);
  },
};

export default adapter;
