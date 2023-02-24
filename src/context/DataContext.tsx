import React, { useContext, useState } from 'react';
import { DeleteDataRequest, PartialData } from '@/models';

type UpdateDataType = (newData: PartialData) => void;
type DeleteDataType = (deleteData: DeleteDataRequest) => void;
type ResetDataType = () => void;

interface DataContext {
  updateData: UpdateDataType;
  setUpdateData(handler: UpdateDataType): void;
  deleteData: DeleteDataType;
  setDeleteData(handler: DeleteDataType): void;
  resetData: ResetDataType;
  setResetData(handler: ResetDataType): void;
}

interface DataContextProviderProps {
  children: any;
}

const initialData = {
  updateData: () => {},
  setUpdateData: () => {},
  deleteData: () => {},
  setDeleteData: () => {},
  resetData: () => {},
  setResetData: () => {},
};

export const DataContext = React.createContext<DataContext>(initialData);

export const DataContextProvider = ({ children }: DataContextProviderProps) => {
  const [updateData, setUpdateData] = useState<UpdateDataType>(() => {});
  const [deleteData, setDeleteData] = useState<DeleteDataType>(() => {});
  const [resetData, setResetData] = useState<ResetDataType>(() => {});

  const value: DataContext = {
    updateData,
    setUpdateData,
    deleteData,
    setDeleteData,
    resetData,
    setResetData,
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
