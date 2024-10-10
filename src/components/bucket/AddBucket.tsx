import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Bucket } from '@/models';
import { useCallback } from 'react';
import { useAccountContext, useDataContext, useUserContext } from '@/context';
import { createTempId } from '@/utils/tempId';

interface AddBucketProps {
  amountBuckets: number;
  lastBucketOrder: number;
}

export const AddBucket = ({ amountBuckets, lastBucketOrder }: AddBucketProps) => {
  const { user } = useUserContext();
  const { account } = useAccountContext();
  const { updateData } = useDataContext();

  const onClickedAddBucket = useCallback(() => {
    const newBucket: Partial<Bucket> = {
      userId: user?.id,
      accountId: account.id,
      name: `My Bucket ${amountBuckets + 1}`,
      temporaryId: createTempId(),
      order: lastBucketOrder + 10,
    };

    updateData({ buckets: [newBucket] }, true);
  }, [user, account.id, amountBuckets, updateData, lastBucketOrder]);

  return (
    <Button type="dashed" icon={<PlusOutlined />} size="large" onClick={onClickedAddBucket}>
      Add Bucket
    </Button>
  );
};
