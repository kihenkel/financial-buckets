import React, { useContext, useState } from 'react';
import { DeleteDataRequest, PartialData } from '@/models';

type UpdateDataType = (newData: PartialData) => void;
type DeleteDataType = (deleteData: DeleteDataRequest) => void;

interface DataContext {
  updateData: UpdateDataType;
  setUpdateData(handler: UpdateDataType): void;
  deleteData: DeleteDataType;
  setDeleteData(handler: DeleteDataType): void;
}

interface DataContextProviderProps {
  children: any;
}

const initialData = {
  updateData: () => {},
  setUpdateData: () => {},
  deleteData: () => {},
  setDeleteData: () => {},
};

export const DataContext = React.createContext<DataContext>(initialData);

export const DataContextProvider = ({ children }: DataContextProviderProps) => {
  const [updateData, setUpdateData] = useState<UpdateDataType>(() => {});
  const [deleteData, setDeleteData] = useState<DeleteDataType>(() => {});

  const value: DataContext = {
    updateData,
    setUpdateData,
    deleteData,
    setDeleteData,
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