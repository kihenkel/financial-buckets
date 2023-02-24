import { Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { PageProps } from '@/components/AppContainer';

import styles from '@/styles/Settings.module.css';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';

const { Title } = Typography;

export default function Settings({ data }: PageProps) {

  return (
    <div className={styles.page}>
      <ToolsBar />
      <div className={styles.main}>
        <Title>Settings</Title>
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
    </div>
  );
}
