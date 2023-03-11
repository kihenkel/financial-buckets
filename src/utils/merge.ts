import { Data, DatabaseModel, DeleteDataRequest, PartialData } from '@/models';
import lodashMergeWith from 'lodash/mergeWith';

const hasEqualIds = (itemA: any, itemB: any): boolean =>
  (itemA.id !== undefined && itemA.id === itemB.id) || 
  (itemA.temporaryId !== undefined && itemA.temporaryId === itemB.temporaryId);

export const mergeUniversal = (...args: any[]): object => {
  return lodashMergeWith(args[0], args[1], args[2],
    // customizer
    (objectA: any, objectB: any): any => {
      // Array START
      if (Array.isArray(objectA) && Array.isArray(objectB)) {
        return objectA.map((itemA) => {
          const foundItemB = objectB.find(itemB => hasEqualIds(itemA, itemB));
          if (foundItemB) {
            return mergeUniversal(itemA, foundItemB);
          }
          return itemA;
        })
          .concat(objectB.filter((itemB) => !objectA.some(itemA => hasEqualIds(itemA, itemB)) ));
      }
      // Array END
    }
  );
};

// This merge function isn't the most readable, but it has been optimized to handle large arrays
// Limits: Merging nested objects or arrays currently is not supported
export const mergeData = (objectA: Data | PartialData | null | undefined, objectB: PartialData | undefined): PartialData => {
  console.log('*** MERGING ***');
  if (!objectA) {
    console.log('objectA does not exist, returning objectB');
    return objectB ?? {};
  }
  if (!objectB) {
    console.log('objectB does not exist, returning objectA');
    return objectA ?? {};
  }
  console.log('+++ 37 +++ objectA', objectA);
  console.log('+++ 38 +++ objectB', objectB);
  const newObjectA = { ...objectA };

  Object.keys(objectB).forEach((rawKey: string) => {
    console.log(`  Processing ${rawKey} ...`);
    const key = rawKey as keyof PartialData;
    if (key === 'user') {
      newObjectA[key] = { ...newObjectA[key], ...objectB[key] };
    } else if (key === 'settings') {
      newObjectA[key] = { ...newObjectA[key], ...objectB[key] };
    } else {
      const itemsA = newObjectA[key] as Partial<DatabaseModel>[];
      const itemsB = objectB[key] as Partial<DatabaseModel>[];
      itemsB.forEach((itemB) => {
        console.log(`    Processing item ${itemB.id || itemB.temporaryId} ...`);
        const foundExistingIndex = itemsA.findIndex((itemA) => hasEqualIds(itemA, itemB));
        if (foundExistingIndex >= 0) {
          console.log(`      Item ${itemB.id || itemB.temporaryId} found in existing data, updating ...`);
          // Updating item
          itemsA[foundExistingIndex] = { ...itemsA[foundExistingIndex], ...itemB };
        } else {
          console.log(`      Item ${itemB.id || itemB.temporaryId} not found in existing data, creating ...`);
          // New item
          itemsA.push(itemB);
        }
      });
      console.log(`  New ${rawKey} list length is`, itemsA.length);
      newObjectA[key] = itemsA;
    }
  });

  return newObjectA;
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