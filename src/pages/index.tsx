import { useEffect, useState } from 'react';
import { Button, Space, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PageProps } from '@/components/AppContainer';

import styles from '@/styles/HomePage.module.css';

const { Title } = Typography;

export default function HomePage({ data }: PageProps) {
  const router = useRouter();
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (!isInitialRender) {
      return;
    }
    if (data.accounts.length === 1) {
      router.push(`/accounts/${data.accounts[0].id}`);
    }
    setIsInitialRender(false);
  }, [isInitialRender, data.accounts, router]);

  if (isInitialRender) {
    return <div className={styles.spinner}><Spin size="large" /></div>;
  }

  return (
    <div className={styles.page}>
      <Title>Choose your account</Title>
      <Space direction="vertical">
        {data.accounts.map((account) => (
          <Button key={account.id} size="large">
            <Link href={`/accounts/${account.id}`}>{account.name}</Link>
          </Button>
        ))}
        <Button icon={<PlusOutlined />} size="large">
          &nbsp;<Link href="/new-account">New account</Link>
        </Button>
      </Space>
    </div>
  );
}
