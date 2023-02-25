import { Button, Space, Upload, Typography, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';

import styles from '@/styles/ImportPage.module.css';
import { useCallback, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { convertCsvToJson } from '@/utils/convertCsvToJson';
import { Bucket } from '@/components/bucket/Bucket';
import { Bucket as BucketModel, ImportData, Transaction } from '@/models';
import { ImportBucket } from '@/models';
import { useAccountContext, useDataContext } from '@/context';
import { useRouter } from 'next/router';

const { Text, Title } = Typography;

export default function ImportPage() {
  const router = useRouter();
  const { account } = useAccountContext();
  const [delimiter, setDelimiter] = useState<string>(',');
  const [parsedCsv, setParsedCsv] = useState<ImportBucket[]>();
  const { importData } = useDataContext();

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const bucketJson = convertCsvToJson(reader.result as string, delimiter);
      setParsedCsv(bucketJson);
    };
    return false;
  }, [delimiter, setParsedCsv]);

  const handleImportClicked = useCallback(() => {
    if (!account.id || !parsedCsv) {
      return;
    }
    const data: ImportData = {
      accountId: account.id,
      buckets: parsedCsv,
    };
    importData(data)
      .then(() => {
        router.push(`/accounts/${account.id}`);
      });
  }, [account, parsedCsv, router, importData]);

  const handleDelimiterChange = useCallback((e: any) => {
    setDelimiter(e.target.value);
  }, [setDelimiter]);

  return (
    <div className={styles.page}>
      <ToolsBar />
      <div className={styles.main}>
        <Space direction="vertical">
          <Title>Import Buckets</Title>
          <Text>You can import buckets and transactions using a CSV formatted file. This feature is still experimental, so confirm your buckets in the preview before uploading.</Text>
          <Input addonBefore="Delimiter" value={delimiter} onChange={handleDelimiterChange} style={{ width: 112 }} />
          <Upload accept=".csv" beforeUpload={handleBeforeUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Select File (CSV)</Button>
          </Upload>
          <Button type="primary" onClick={handleImportClicked} disabled={!parsedCsv} style={{ marginTop: 16 }}>Import</Button>
          {parsedCsv && (
            <>
              <Title level={3}>Bucket Preview</Title>
              <Text type="success">
                Importing {parsedCsv.length} buckets with {parsedCsv.reduce((currentNumber, bucketJson) => currentNumber + bucketJson.transactionAmounts.length, 0)} transactions.
              </Text>
              <div className={styles.buckets}>
                {parsedCsv.map((importBucket, index) => {
                  const bucket = {
                    name: importBucket.name,
                  } as BucketModel;
                  const balance = importBucket.transactionAmounts.reduce((amount, transaction) => amount + transaction, 0);
                  const transactions = importBucket.transactionAmounts.map((transaction) => ({
                    amount: transaction,
                    date: new Date().toISOString(),
                  })) as Transaction[];
                  return (
                    <Bucket
                      key={importBucket.name || index}
                      bucket={bucket}
                      balance={balance}
                      transactions={transactions}
                    />
                  );
                }
                )}
              </div>
            </>
          )}
        </Space>
      </div>
    </div>
  );
}
