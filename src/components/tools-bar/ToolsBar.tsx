import { Divider } from 'antd';
import { CSSProperties } from 'react';
import { useRouter } from 'next/router';
import { HomeOutlined, FileSyncOutlined, SettingOutlined } from '@ant-design/icons';

import styles from '@/styles/ToolsBar.module.css';
import { ToolsBarButton } from './ToolsBarButton';
import { useAccountContext } from '@/context';

const dividerStyle: CSSProperties = {
  margin: '8px 0'
};

const buttons = [{
  id: '1',
  getHref: (account: any) => `/accounts/${account?.id}`,
  icon: <HomeOutlined />
}, {
  id: '2',
  getHref: (account: any) => `/accounts/${account?.id}/recurring`,
  icon: <FileSyncOutlined />
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
          <ToolsBarButton key={button.id} linkHref={isCurrentPath ? undefined : href} type={isCurrentPath ? 'default' : 'text'}>
            { button.icon }
          </ToolsBarButton>
        );
      })}
      <Divider style={dividerStyle} />
      <ToolsBarButton><SettingOutlined /></ToolsBarButton>
    </div>
  );
};
