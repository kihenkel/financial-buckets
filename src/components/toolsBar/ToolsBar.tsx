import { Divider } from 'antd';
import { CSSProperties } from 'react';
import { useRouter } from 'next/router';
import { HomeOutlined, FileSyncOutlined, SettingOutlined, ImportOutlined, DashboardOutlined } from '@ant-design/icons';

import styles from '@/styles/ToolsBar.module.css';
import { ToolsBarButton } from './ToolsBarButton';
import { useAccountContext } from '@/context';

const dividerStyle: CSSProperties = {
  margin: '8px 0'
};

const buttons = [{
  id: '1',
  getHref: (account: any) => `/accounts/${account?.id}`,
  icon: <HomeOutlined />,
  title: 'Home',
}, {
  id: '2',
  getHref: (account: any) => `/accounts/${account?.id}/recurring`,
  icon: <FileSyncOutlined />,
  title: 'Recurring items',
}, {
  id: '3',
  getHref: (account: any) => `/accounts/${account?.id}/import`,
  icon: <ImportOutlined />,
  title: 'Import',
}, {
  id: '4',
  getHref: (account: any) => `/accounts/${account?.id}/optimize`,
  icon: <DashboardOutlined />,
  title: 'Optimize',
}];

export const ToolsBar = () => {
  const router = useRouter();
  const { account } = useAccountContext();
  return (
    <div className={styles.toolsBar}>
      {buttons.map((button) => {
        const href = button.getHref(account);
        const isCurrentPath = href === router.asPath;
        return (
          <ToolsBarButton key={button.id} linkHref={isCurrentPath ? undefined : href} type={isCurrentPath ? 'default' : 'text'} title={button.title}>
            { button.icon }
          </ToolsBarButton>
        );
      })}
      <Divider style={dividerStyle} />
      <ToolsBarButton linkHref="/settings" type={router.asPath === '/settings' ? 'default' : 'text'}><SettingOutlined /></ToolsBarButton>
    </div>
  );
};
