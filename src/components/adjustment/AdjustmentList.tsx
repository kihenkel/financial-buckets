import React from 'react';
import { List } from 'antd';
import { Adjustment } from '@/models';
import { AdjustmentItem } from './AdjustmentItem';
import { RefObject } from 'react';

interface AdjustmentListProps {
  adjustments: Adjustment[];
  listRef: RefObject<HTMLDivElement>;
}

export const AdjustmentList = ({ adjustments, listRef }: AdjustmentListProps) => {
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
        dataSource={adjustments}
        size="small"
        renderItem={(adjustment) => <AdjustmentItem key={adjustment.id} adjustment={adjustment} />}
      />
    </div>
  );
};
