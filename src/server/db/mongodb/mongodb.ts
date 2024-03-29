import { connect, disconnect, isConnected } from '@/server/db/mongodb/connection';
import { DatabaseAdapter } from '@/server/db/types';
import models from '@/server/db/mongodb/models';
import { LeanDocument } from 'mongoose';

const mongoToDomainModel = (data: LeanDocument<any> | undefined) => {
  if (!data) {
    return data;
  }
  data.id = data._id.toString();
  data._id = undefined;
  data.__v = undefined;
  return data;
};

const domainToMongoModel = (data: any) => {
  const mongoModel = { ...data };
  delete mongoModel.id;
  return mongoModel;
};

const adapter: DatabaseAdapter = {
  connect,
  disconnect,
  isConnected,
  getAll: async (modelName, query) => {
    const MongooseModel = models[modelName];
    const filter = query?.toMongooseFilterQuery() ?? {};
    const docs = await MongooseModel.find(filter).lean().exec();
    return docs.map(mongoToDomainModel);
  },
  getFirst: async (modelName, query) => {
    const MongooseModel = models[modelName];
    const filter = query?.toMongooseFilterQuery() ?? {};
    const doc = await MongooseModel.findOne(filter).lean().exec();
    return mongoToDomainModel(doc);
  },
  get: async (modelName, id) => {
    const MongooseModel = models[modelName];
    const doc = await MongooseModel.findById(id).lean().exec();
    return mongoToDomainModel(doc);
  },
  add: async (modelName, data) => {
    const MongooseModel = models[modelName];
    const model = new MongooseModel(data);
    const doc = (await model.save()).toObject();
    return mongoToDomainModel(doc);
  },
  addAll: async (modelName, dataList) => {
    const MongooseModel = models[modelName];
    const docs = await MongooseModel.insertMany(dataList);
    return docs.map((doc) => mongoToDomainModel(doc.toObject()));
  },
  update: async (modelName, query, data) => {
    const MongooseModel = models[modelName];
    const filter = query.toMongooseFilterQuery();
    const mongoData = domainToMongoModel(data);
    const doc = await MongooseModel.findOneAndUpdate(filter, mongoData, { new: true }).exec();
    return mongoToDomainModel(doc);
  },
  updateAll: async (modelName, queries, dataList) => {
    const MongooseModel = models[modelName];
    const bulkOperations = queries.map((query, index) => ({
      updateOne: {
        filter: query.toMongooseFilterQuery(),
        update: domainToMongoModel(dataList[index]),
      }
    }));
    await MongooseModel.bulkWrite(bulkOperations);
    return dataList;
  },
  deleteAll: async (modelName, query) => {
    const MongooseModel = models[modelName];
    const filter = query.toMongooseFilterQuery();
    await MongooseModel.deleteMany(filter).exec();
  },
};

export default adapter;
