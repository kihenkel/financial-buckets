import { useCallback, useEffect, useState } from 'react';
import { Data, DeleteDataRequest, ImportData, PartialData } from '@/models';
import http from '@/utils/http';
import { mergeUniversal, mergeData, mergeDeletion } from '@/utils/merge';
import { useRouter } from 'next/router';
import { applyServerData } from '@/utils/applyServerData';
import { prepareRequestData, RequestData } from '@/utils/requestData';
import { useNotificationContext, useUserConfigContext } from '@/context';
import { getChangeMessage } from '@/utils/getChangeMessage';

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
  optimizeBucket(bucketId: string): Promise<void>;
  forceUpdate(): Promise<void>;
  reset(): void
  data?: Data;
  error?: Error;
}
const requestDataCached: RequestData = { put: null, remove: null };
let hasPrefetched = false;

export const useData = ({ shouldLoad }: UseDataProps): UseDataReturn => {
  const router = useRouter();
  const [data, setData] = useState<Data | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<Error>();
  const { locale, currency } = useUserConfigContext();
  const { setInfo } = useNotificationContext();

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
    const requestData = prepareRequestData(requestDataCached);
    const putPromise = requestData.put ? doRequest('put', '/api/data', requestData.put) : Promise.resolve();
    const updateReponse = await putPromise;

    const removePromise = requestData.remove ? doRequest('remove', '/api/data', requestData.remove) : Promise.resolve();
    await removePromise;

    if (updateReponse) {
      const mergedData = applyServerData(data, requestData.put, updateReponse);
      setData(mergedData);
    }
    requestDataCached.put = null;
    requestDataCached.remove = null;
  }, [data, doRequest, setData]);

  const doRequestThrottled = useCallback((method: HttpMethod, path: string, force: boolean, newData?: any) => {
    if (!force && (method === 'put' || method === 'remove') && !data?.settings.shouldAutosave) {
      if (method === 'put') {
        requestDataCached.put = mergeData(requestDataCached.put, newData);
      } else if (method === 'remove') {
        requestDataCached.remove = mergeUniversal(requestDataCached.remove, newData);
      }
      setIsStale(true);
      return Promise.resolve();
    }
    return doRequest(method, path, newData);
  }, [data?.settings.shouldAutosave, doRequest]);

  const doPrefetch = useCallback(() => {
    if (hasPrefetched) {
      return;
    }
    hasPrefetched = true;
    return doRequest('get', '/api/prefetch');
  }, [doRequest]);

  const fetchData = useCallback(() => {
    const path = accountId ? `/api/data?accountId=${accountId}` : '/api/data';
    return doRequest('get', path)
      .then((response) => {
        setData(response);
        const changeMessage = getChangeMessage(response.changes, response.buckets, locale, currency);
        if (changeMessage) {
          setInfo(changeMessage);
        }
      });
  }, [accountId, locale, currency, doRequest, setData, setInfo]);

  const update = useCallback((newData: PartialData, force: boolean = false): Promise<void> => {
    const mergedData = mergeData(data, newData) as Data;
    setData(mergedData);

    return doRequestThrottled('put', '/api/data', force, newData)
      .then((response) => {
        if (response) {
          const mergedData = applyServerData(data, newData, response);
          setData(mergedData);
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

  const optimizeBucket = useCallback((bucketId: string): Promise<void> => {
    return doRequestThrottled('post', `/api/optimize?bucketId=${bucketId}`, true)
      .then(() => {
        fetchData();
      });
  }, [doRequestThrottled, fetchData]);

  const reset = useCallback(() => {
    setData(undefined);
  }, [setData]);

  useEffect(() => {
    if (!shouldLoad && !hasPrefetched) {
      doPrefetch();
    }
  }, [shouldLoad, doPrefetch]);

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
    optimizeBucket,
    forceUpdate,
    reset,
  };
};
