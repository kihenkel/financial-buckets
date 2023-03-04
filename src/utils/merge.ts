import { Data, DatabaseModel, DeleteDataRequest } from '@/models';
import lodashMergeWith from 'lodash/mergeWith';

export const merge = (...args: any[]): object => {
  return lodashMergeWith(args[0], args[1], args[2],
    // customizer
    (objectA: any, objectB: any): any => {
      // Array START
      if (Array.isArray(objectA) && Array.isArray(objectB)) {
        return objectA.map((itemA) => {
          const foundItemB = objectB.find(itemB => itemA.id !== undefined && itemA.id === itemB.id);
          if (foundItemB) {
            return merge(itemA, foundItemB);
          }
          return itemA;
        })
          .concat(objectB.filter((itemB) => !itemB.id || !objectA.some(itemA => itemA.id === itemB.id) ));
      }
      // Array END
    }
  );
};

export const mergeDeletion = (data: Data, deleteDataRequest: DeleteDataRequest): Data => {
  return Object.keys(deleteDataRequest).reduce((currentData, key: string) => {
    const deleteKey = key as keyof DeleteDataRequest;
    const deleteIds = deleteDataRequest[deleteKey];
    if (!deleteIds) return currentData;
    const itemList = data[deleteKey] as any[];
    return {
      ...currentData,
      [key]: itemList.filter((value: DatabaseModel) => !deleteIds.includes(value.id)),
    };
  }, data);
};