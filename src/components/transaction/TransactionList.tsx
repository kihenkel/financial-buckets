import React from 'react';
import { List } from 'antd';
import { Transaction } from '@/models';
import { TransactionItem } from './TransactionItem';
import { RefObject } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
  listRef: RefObject<HTMLDivElement>;
}

export const TransactionList = ({ transactions, listRef }: TransactionListProps) => {
  return (
    <div
      id="scrollableDiv"
      ref={listRef}
      style={{
        height: 200,
        overflow: 'auto',
        padding: '0 4px',
      }}
    >
      <List
        dataSource={transactions}
        size="small"
        renderItem={(transaction) => <TransactionItem key={transaction.id} transaction={transaction} />}
      />
    </div>
  );
};
