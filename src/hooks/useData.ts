import { useCallback, useEffect, useState } from 'react';
import { Data, DeleteDataRequest, ImportData, PartialData } from '@/models';
import http from '@/utils/http';
import { merge, mergeDeletion } from '@/utils/merge';
import { useRouter } from 'next/router';

interface UseDataProps {
  shouldLoad: boolean;
}

interface UseDataReturn {
  isLoading: boolean;
  update(newData: PartialData): Promise<void>;
  remove(deleteData: DeleteDataRequest): Promise<void>;
  importData(importData: ImportData): Promise<void>;
  data?: Data;
  error?: Error;
}

export const useData = ({ shouldLoad }: UseDataProps): UseDataReturn => {
  const router = useRouter();
  const [data, setData] = useState<Data | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const { accountId } = router.query;

  const doRequest = useCallback((method: 'get' | 'put' | 'post' | 'remove', path: string, data?: any) => {
    setIsLoading(true);
    return http[method](path, data)
      .then((response) => {
        setIsLoading(false);
        return response as any;
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(`Requesting ${method} on path ${path} failed with error`, error);
        setError(error);
      });
  }, [setIsLoading, setError]);

  const fetchData = useCallback(() => {
    const path = accountId ? `/api/data?accountId=${accountId}` : '/api/data';
    return doRequest('get', path)
      .then((response) => {
        setData(response);
      });
  }, [accountId, doRequest, setData]);

  const update = useCallback((newData: PartialData): Promise<void> => {
    const mergedData = merge({}, data, newData) as Data;
    setData(mergedData);

    return doRequest('put', '/api/data', newData)
      .then((response) => {
        const serverMergedData = merge({}, data, response) as Data;
        setData(serverMergedData);
      });
  }, [data, doRequest, setData]);

  const remove = useCallback((deleteData: DeleteDataRequest): Promise<void> => {
    if (!data) return Promise.resolve();
    const mergedData = mergeDeletion(data, deleteData);
    setData(mergedData);

    return doRequest('put', '/api/data', deleteData);
  }, [data, doRequest, setData]);

  const importData = useCallback((importData: ImportData): Promise<void> => {
    setData(undefined);

    return doRequest('post', '/api/import', importData)
      .then(() => {
        fetchData();
      });
  }, [data, doRequest, setData, fetchData]);

  useEffect(() => {
    if (shouldLoad) {
      fetchData();
    }
  }, [shouldLoad, fetchData]);

  return {
    data,
    isLoading,
    error,
    update,
    remove,
    importData,
  };
};
