import { Currency, Locale } from '@/context';
import { Adjustment, Bucket, Transaction } from '@/models';
import { toCurrency } from './toCurrency';

interface DataChanges {
  createdTransactions: Transaction[];
  createdAdjustments: Adjustment[];
  removedAdjustments: Adjustment[];
}

const getBucketName = (transaction: Transaction, buckets: Bucket[]) => {
  const bucket = buckets.find((item) => item.id === transaction.bucketId);
  return bucket?.name ?? 'BUCKET_NOT_FOUND';
};

export const getChangeMessage = (changes: DataChanges, buckets: Bucket[], locale: Locale, currency: Currency): string => {
  let messageList: string[] = [];
  if (changes.createdAdjustments?.length > 0) {
    messageList.push(`Added ${changes.createdAdjustments.length} adjustments:`);
    messageList = messageList.concat(changes.createdAdjustments.map((adjustment, index, arr) => `${adjustment.label} (${toCurrency(adjustment.amount, locale, currency)})${index < arr.length - 1 ? ',' : '.'}`));
  }
  if (changes.removedAdjustments?.length > 0) {
    messageList.push(`Removed ${changes.removedAdjustments.length} adjustments:`);
    messageList = messageList.concat(changes.removedAdjustments.map((adjustment, index, arr) => `${adjustment.label} (${toCurrency(adjustment.amount, locale, currency)})${index < arr.length - 1 ? ',' : '.'}`));
  }
  if (changes.createdTransactions?.length > 0) {
    messageList.push(`Added ${changes.createdTransactions.length} transactions:`);
    messageList = messageList.concat(changes.createdTransactions.map((transaction, index, arr) => `${getBucketName(transaction, buckets)} (${toCurrency(transaction.amount, locale, currency)})${index < arr.length - 1 ? ',' : '.'}`));
  }
  if (messageList.length <= 0) return '';

  return messageList.join(' ');
};
