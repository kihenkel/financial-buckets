import { FilterQuery } from 'mongoose';
import { DatabaseModel } from '@/models';
// import testData from '../../../../testData.json';

type FilterOperatorHandler = { [key: string]: (entry: any, filterKey: string, filterValue: any) => boolean };

// This memory db mostly mirrors MongoDb filters and operators
const data: any = {};
// const data: any = testData;

const filterOperatorHandler: FilterOperatorHandler = {
  '$in': (entry: any, filterKey: string, filterValue: any[]) => filterValue.includes(entry[filterKey]),
  '$exists': (entry: any, filterKey: string, filterValue: boolean) => (entry[filterKey] !== undefined && entry[filterKey] !== null) === filterValue,
};

const createDbDoc = (data: any): DatabaseModel => {
  const dbModel = {
    ...data,
    id: `${String(Date.now())}${String(Math.random()).replace('.', '')}`,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };
  return dbModel;
};

const isFilterMatch = (entry: any, filter: FilterQuery<any> | undefined) => {
  if (!filter) return true;
  const filterKeys = Object.keys(filter);
  return filterKeys.every((filterKey) => {
    const filterValue = filter[filterKey];
    if (filterValue === undefined) {
      return true;
    } else if (typeof filterValue === 'object') {
      const operators = Object.keys(filterValue);
      if (operators.length > 1) {
        throw new Error('Multiple filter operators not supported (yet)!');
      }
      const [operator] = operators;
      const handler = filterOperatorHandler[operator];
      if (!handler) {
        throw new Error(`Filter operator ${operator} not supported!`);
      }
      return handler(entry, filterKey, filterValue[operator]);
    }
    return entry[filterKey] === filterValue;
  });
};

const save = (modelName: string, newData: any) => {
  if (!data[modelName]) {
    data[modelName] = [];
  }
  const doc = createDbDoc(newData);
  data[modelName].push(doc);
  return doc;
};

const findById = (modelName: string, id: string): DatabaseModel | undefined => {
  if (!data[modelName]) return undefined;
  return data[modelName].find((entry: DatabaseModel) => entry.id === id);
};

const find = (modelName: string, filter: FilterQuery<any>): DatabaseModel[] => {
  if (!data[modelName]) return [];
  return data[modelName].filter((entry: DatabaseModel) => isFilterMatch(entry, filter));
};

const findOne = (modelName: string, filter: FilterQuery<any>): DatabaseModel | undefined => {
  if (!data[modelName]) return undefined;
  return data[modelName].find((entry: DatabaseModel) => {
    const isMatch = isFilterMatch(entry, filter);
    return isMatch;
  });
};

const updateOne = (modelName: string, filter: FilterQuery<any>, newData: any): DatabaseModel | undefined => {
  if (!data[modelName]) return undefined;
  const index = data[modelName].findIndex((entry: any) => isFilterMatch(entry, filter));
  if (index < 0) return undefined;
  const newEntry = {
    ...data[modelName][index],
    ...newData,
    modifiedAt: new Date().toISOString(),
  };
  data[modelName] = data[modelName].slice(0, index).concat(newEntry, data[modelName].slice(index + 1));
  return newEntry;
};

const deleteMany = (modelName: string, filter: FilterQuery<any>) => {
  if (!data[modelName]) return undefined;
  data[modelName] = data[modelName].filter((entry: any) => !isFilterMatch(entry, filter));
};

const db = {
  save,
  findById,
  find,
  findOne,
  updateOne,
  deleteMany,
};

export default db;
