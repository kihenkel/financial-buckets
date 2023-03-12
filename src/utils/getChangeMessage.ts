interface DataChanges {
  createdTransactions: number;
  createdAdjustments: number;
  removedAdjustments: number;
}

export const getChangeMessage = (changes: DataChanges): string => {
  const messageList = [];
  if (changes.createdAdjustments) {
    messageList.push(`Added ${changes.createdAdjustments} adjustments.`);
  }
  if (changes.removedAdjustments) {
    messageList.push(`Removed ${changes.removedAdjustments} adjustments.`);
  }
  if (changes.createdTransactions) {
    messageList.push(`Added ${changes.createdTransactions} transactions.`);
  }
  if (messageList.length <= 0) return '';

  return messageList.join(' ');
};
