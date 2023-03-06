import { Data, DatabaseModel, DeleteDataRequest } from '@/models';
import lodashMergeWith from 'lodash/mergeWith';

const hasEqualIds = (itemA: any, itemB: any): boolean =>
  (itemA.id !== undefined && itemA.id === itemB.id) || 
  (itemA.temporaryId !== undefined && itemA.temporaryId === itemB.temporaryId);

export const merge = (...args: any[]): object => {
  return lodashMergeWith(args[0], args[1], args[2],
    // customizer
    (objectA: any, objectB: any): any => {
      // Array START
      if (Array.isArray(objectA) && Array.isArray(objectB)) {
        return objectA.map((itemA) => {
          const foundItemB = objectB.find(itemB => hasEqualIds(itemA, itemB));
          if (foundItemB) {
            return merge(itemA, foundItemB);
          }
          return itemA;
        })
          .concat(objectB.filter((itemB) => !objectA.some(itemA => hasEqualIds(itemA, itemB)) ));
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
      [key]: itemList.filter((value: DatabaseModel) => !deleteIds.includes(value.id ?? value.temporaryId)),
    };
  }, data);
};