import { useCallback, useEffect, useState } from 'react';
import { Data, DeleteDataRequest, ImportData, PartialData } from '@/models';
import http from '@/utils/http';
import { merge, mergeDeletion } from '@/utils/merge';
import { useRouter } from 'next/router';

type HttpMethod = 'get' | 'put' | 'post' | 'remove';

interface UseDataProps {
  shouldLoad: boolean;
}

interface UseDataReturn {
  isLoading: boolean;
  isStale: boolean;
  update(newData: PartialData, force?: boolean): Promise<void>;
  remove(deleteData: DeleteDataRequest, force?: boolean): Promise<void>;
  importData(importData: ImportData): Promise<void>;
  forceUpdate(): Promise<void>;
  data?: Data;
  error?: Error;
}
interface RequestData { put: PartialData | null, remove: DeleteDataRequest | null };
const requestDataCached: RequestData = { put: null, remove: null };

export const useData = ({ shouldLoad }: UseDataProps): UseDataReturn => {
  const router = useRouter();
  const [data, setData] = useState<Data | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<Error>();

  const { accountId } = router.query;

  const doRequest = useCallback((method: HttpMethod, path: string, newData?: any) => {
    setIsLoading(true);
    return http[method](path, newData)
      .then((response) => {
        setIsLoading(false);
        setIsStale(false);
        return response as any;
      })
      .catch((error) => {
        setIsLoading(false);
        setIsStale(false);
        console.error(`Requesting ${method} on path ${path} failed with error`, error);
        setError(error);
      });
  }, [setIsLoading, setError]);

  const forceUpdate = useCallback(async () => {
    const putPromise = requestDataCached.put ? doRequest('put', '/api/data', requestDataCached.put) : Promise.resolve();
    const updateReponse = await putPromise;
    requestDataCached.put = null;

    const removePromise = requestDataCached.remove ? doRequest('remove', '/api/data', requestDataCached.remove) : Promise.resolve();
    await removePromise;
    requestDataCached.remove = null;

    if (updateReponse) {
      const serverMergedData = merge({}, data, updateReponse) as Data;
      setData(serverMergedData);
    }
  }, [data, doRequest, setData]);

  const doRequestThrottled = useCallback((method: HttpMethod, path: string, force: boolean, newData?: any) => {
    if (!force && (method === 'put' || method === 'remove') && !data?.settings.shouldAutosave) {
      requestDataCached[method] = merge(requestDataCached[method], newData);
      setIsStale(true);
      return Promise.resolve();
    }
    return doRequest(method, path, newData);
  }, [data?.settings.shouldAutosave, doRequest]);

  const fetchData = useCallback(() => {
    const path = accountId ? `/api/data?accountId=${accountId}` : '/api/data';
    return doRequestThrottled('get', path, true)
      .then((response) => {
        setData(response);
      });
  }, [accountId, doRequestThrottled, setData]);

  const update = useCallback((newData: PartialData, force: boolean = false): Promise<void> => {
    const mergedData = merge({}, data, newData) as Data;
    setData(mergedData);

    return doRequestThrottled('put', '/api/data', force, newData)
      .then((response) => {
        if (response) {
          const serverMergedData = merge({}, data, response) as Data;
          setData(serverMergedData);
        }
      });
  }, [data, doRequestThrottled, setData]);

  const remove = useCallback((deleteData: DeleteDataRequest, force: boolean = false): Promise<void> => {
    if (!data) return Promise.resolve();
    const mergedData = mergeDeletion(data, deleteData);
    setData(mergedData);

    return doRequestThrottled('remove', '/api/data', force, deleteData);
  }, [data, doRequestThrottled, setData]);

  const importData = useCallback((importData: ImportData): Promise<void> => {
    setData(undefined);

    return doRequestThrottled('post', '/api/import', true, importData)
      .then(() => {
        fetchData();
      });
  }, [doRequestThrottled, setData, fetchData]);

  useEffect(() => {
    if (shouldLoad && !data) {
      fetchData();
    }
  }, [shouldLoad, data, fetchData]);

  return {
    data,
    isLoading,
    isStale,
    error,
    update,
    remove,
    importData,
    forceUpdate,
  };
};
