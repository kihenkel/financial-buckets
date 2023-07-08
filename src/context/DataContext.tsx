import React, { useContext, useState } from 'react';
import { DeleteDataRequest, ImportData, PartialData } from '@/models';

type UpdateDataHandlerType = (newData: PartialData, force?: boolean) => Promise<void>;
type DeleteDataHandlerType = (deleteData: DeleteDataRequest, force?: boolean) => Promise<void>;
type ImportDataHandlerType = (importData: ImportData) => Promise<void>;
type OptimizeBucketHandlerType = (bucketId: string, maxTransactions?: number) => Promise<void>;
type OptimizeAllBucketsHandlerType = (accountId: string, maxTransactions?: number) => Promise<void>;

interface DataContext {
  updateData: UpdateDataHandlerType;
  setUpdateData(handler: UpdateDataHandlerType): void;
  deleteData: DeleteDataHandlerType;
  setDeleteData(handler: DeleteDataHandlerType): void;
  importData: ImportDataHandlerType;
  setImportData(handler: ImportDataHandlerType): void;
  optimizeBucket: OptimizeBucketHandlerType;
  setOptimizeBucket(handler: OptimizeBucketHandlerType): void;
  optimizeAllBuckets: OptimizeAllBucketsHandlerType;
  setOptimizeAllBuckets(handler: OptimizeAllBucketsHandlerType): void;
}

interface DataContextProviderProps {
  children: any;
}

const initialData = {
  updateData: () => Promise.resolve(),
  setUpdateData: () => {},
  deleteData: () => Promise.resolve(),
  setDeleteData: () => {},
  importData: () => Promise.resolve(),
  setImportData: () => {},
  optimizeBucket: () => Promise.resolve(),
  setOptimizeBucket: () => {},
  optimizeAllBuckets: () => Promise.resolve(),
  setOptimizeAllBuckets: () => {},
};

export const DataContext = React.createContext<DataContext>(initialData);

export const DataContextProvider = ({ children }: DataContextProviderProps) => {
  const [updateData, setUpdateDataInternal] = useState<UpdateDataHandlerType>(() => Promise.resolve());
  const [deleteData, setDeleteDataInternal] = useState<DeleteDataHandlerType>(() => Promise.resolve());
  const [importData, setImportDataInternal] = useState<ImportDataHandlerType>(() => Promise.resolve());
  const [optimizeBucket, setOptimizeBucketInternal] = useState<OptimizeBucketHandlerType>(() => Promise.resolve());
  const [optimizeAllBuckets, setOptimizeAllBucketsInternal] = useState<OptimizeAllBucketsHandlerType>(() => Promise.resolve());

  const value: DataContext = {
    updateData,
    setUpdateData: (handler) => setUpdateDataInternal(() => handler),
    deleteData,
    setDeleteData: (handler) => setDeleteDataInternal(() => handler),
    importData,
    setImportData: (handler) => setImportDataInternal(() => handler),
    optimizeBucket,
    setOptimizeBucket: (handler) => setOptimizeBucketInternal(() => handler),
    optimizeAllBuckets,
    setOptimizeAllBuckets: (handler) => setOptimizeAllBucketsInternal(() => handler),
  };
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
