export interface ImportBucket {
  name: string;
  transactionAmounts: number[];
}

export interface ImportData {
  accountId: string;
  buckets: ImportBucket[];
}
