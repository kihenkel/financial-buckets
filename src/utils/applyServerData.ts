import { Data, DatabaseModel, DeleteDataRequest, PartialData } from '@/models';
import { merge, mergeDeletion } from '@/utils/merge';

export const applyServerData = (currentData: Data | undefined, localData: PartialData | null, serverData: PartialData): Data => {
  if (!localData) {
    return merge({}, currentData, serverData) as Data;
  }
  const deleteDataRequestLocal: DeleteDataRequest = Object.keys(localData).reduce((currentRequest, localKey) => {
    const key = localKey as keyof DeleteDataRequest;
    const items = localData[key] ?? [] as Partial<DatabaseModel>[];
    const temporaryIds = items.filter((item) => {
      if (!item.id) {
        if (!item.temporaryId) {
          console.warn(`${key} item does neither have an id nor a temporaryId!`);
          return false;
        }
        return true;
      }
    }).map((item) => item.temporaryId ?? '');
    return {
      ...currentRequest,
      [key]: temporaryIds,
    };
  }, {} as DeleteDataRequest);

  const withoutLocalData = currentData ? mergeDeletion(currentData, deleteDataRequestLocal) : {};
  const withServerData = merge({}, withoutLocalData, serverData) as Data;
  return withServerData;
};
