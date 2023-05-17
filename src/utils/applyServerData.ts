import { Data, DatabaseModel, DeleteDataRequest, PartialData } from '@/models';
import { mergeData, mergeDeletion } from '@/utils/merge';

export const applyServerData = (currentData: Data | undefined, localData: PartialData | null, serverData: PartialData): Data => {
  if (!localData) {
    return mergeData(currentData, serverData) as Data;
  }
  const deleteDataRequestLocal: DeleteDataRequest = Object.keys(localData).reduce((currentRequest, localKey) => {
    const key = localKey as keyof DeleteDataRequest;
    const items = localData[key] ?? [] as Partial<DatabaseModel>[];
    const temporaryIds = Array.isArray(items) ? items.filter((item) => {
      if (!item.id) {
        if (!item.temporaryId) {
          console.warn(`${key} item does neither have an id nor a temporaryId!`);
          return false;
        }
        return true;
      }
    }).map((item) => item.temporaryId ?? '') : [];
    return {
      ...currentRequest,
      [key]: temporaryIds,
    };
  }, {} as DeleteDataRequest);

  const withoutLocalData = currentData ? mergeDeletion(currentData, deleteDataRequestLocal) : {} as Data;
  const withServerData = mergeData(withoutLocalData, serverData) as Data;
  return withServerData;
};
