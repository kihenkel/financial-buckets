import { useEffect } from 'react';
import { Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Data } from '@/models';
import { PageProps } from '@/components/AppContainer';

import styles from '@/styles/HomePage.module.css';

const { Title } = Typography;

const needsIntroduction = (data?: Data) => data && (!data.user.name || !data.accounts[0]?.name);

export default function HomePage({ data }: PageProps) {
  const router = useRouter();

  useEffect(() => {
    const isIntroductionNeeded = needsIntroduction(data);
    if (isIntroductionNeeded) {
      router.push('/introduction');
    } else if (data.accounts.length === 1) {
      router.push(`/accounts/${data.accounts[0].id}`);
    }
  }, [data]);

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
