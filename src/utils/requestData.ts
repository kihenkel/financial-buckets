import { DatabaseModel, DeleteDataRequest, PartialData } from '@/models';
import { isTempId } from './tempId';

export interface RequestData {
  put: PartialData | null;
  remove: DeleteDataRequest | null;
};

export const prepareRequestData = (requestData: RequestData): RequestData => {
  if (!requestData.remove || !requestData.put) {
    return requestData;
  }
  const putData = Object.keys(requestData.put).reduce((currentData, rawKey) => {
    const putKey = rawKey as keyof PartialData;
    const removeKey = rawKey as keyof DeleteDataRequest;
    const removeTempIds = requestData.remove?.[removeKey]?.filter(isTempId) ?? [];
    const partialDataEntry = requestData.put?.[putKey] as DatabaseModel[] | DatabaseModel;
    const items = Array.isArray(partialDataEntry) ? partialDataEntry?.filter((item) => !item.temporaryId || !removeTempIds.includes(item.temporaryId)) : partialDataEntry;
    return {
      ...currentData,
      [putKey]: items,
    };
  }, {} as PartialData);

  const removeData = Object.keys(requestData.remove).reduce((currentData, rawKey) => {
    const removeKey = rawKey as keyof DeleteDataRequest;
    const removeTempIds = requestData.remove?.[removeKey]?.filter((id) => !isTempId(id)) ?? [];
    return {
      ...currentData,
      [removeKey]: removeTempIds,
    };
  }, {} as DeleteDataRequest);

  return { put: putData, remove: removeData };
};
