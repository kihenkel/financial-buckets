import { useCallback, useEffect, useState } from 'react';
import { Data, DeleteDataRequest, PartialData } from '@/models';
import http from '@/utils/http';
import { merge, mergeDeletion } from '@/utils/merge';
import { useRouter } from 'next/router';

interface UseDataProps {
  shouldLoad: boolean;
}

interface UseDataReturn {
  isLoading: boolean;
  update(newData: PartialData): void;
  remove(deleteData: DeleteDataRequest): void;
  reset(): void;
  data?: Data;
  error?: Error;
}

export const useData = ({ shouldLoad }: UseDataProps): UseDataReturn => {
  const router = useRouter();
  const [data, setData] = useState<Data | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const { accountId } = router.query;

  const fetchData = useCallback(() => {
    setIsLoading(true);

    const path = accountId ? `/api/data?accountId=${accountId}` : '/api/data';
    http.get<Data>(path)
      .then((response) => {
        setIsLoading(false);
        setData(response);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Fetching data failed with error', error);
        setError(error);
      });
  }, [accountId, setData, setIsLoading, setError]);

  const update = useCallback((newData: PartialData) => {
    const mergedData = merge({}, data, newData) as Data;
    setData(mergedData);

    setIsLoading(true);

    http.put<Partial<Data>>('/api/data', newData)
      .then((response) => {
        setIsLoading(false);
        const serverMergedData = merge({}, data, response) as Data;
        setData(serverMergedData);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Putting data failed with error', error);
        setError(error);
      });
  }, [data, setData, setIsLoading, setError]);

  const remove = useCallback((deleteData: DeleteDataRequest) => {
    if (!data) return;
    const mergedData = mergeDeletion(data, deleteData);
    setData(mergedData);

    setIsLoading(true);

    http.remove('/api/data', deleteData)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Deleting data failed with error', error);
        setError(error);
      });
  }, [data, setData, setIsLoading, setError]);

  const reset = useCallback(() => {
    setData(undefined);
    if (shouldLoad) {
      fetchData();
    }
  }, [shouldLoad, setData, fetchData]);

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
    reset,
  };
};
