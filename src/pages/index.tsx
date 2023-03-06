import { Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { PageProps } from '@/components/AppContainer';

import styles from '@/styles/HomePage.module.css';

const { Title } = Typography;

export default function HomePage({ data }: PageProps) {
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
