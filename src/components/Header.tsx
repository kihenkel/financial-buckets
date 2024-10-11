import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Dropdown } from 'antd';
import { PlusOutlined, DownOutlined, PieChartOutlined } from '@ant-design/icons';

import styles from '@/styles/Layout.module.css';
import { useAccountContext, useUserContext } from '@/context';
import { useRouter } from 'next/router';
import { Account, Data } from '@/models';
import { AccountTypeMap } from '@/utils/accountUtils';

const isSummaryPath = (pathname: string) => pathname === '/summary';
const showAccountSelection = (pathname: string) => pathname.startsWith('/accounts') || isSummaryPath(pathname);

interface HeaderProps {
  data?: Data;
}

const getAccountName = (account: Partial<Account>) => {
  if (!account.name) {
    return 'Unnamed account';
  }
  if (!account.type) {
    return account.name;
  }
  return `${account.name} (${AccountTypeMap[account.type]})`;
};

export const Header = ({ data }: HeaderProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { account } = useAccountContext();
  const { user } = useUserContext();

  const isSummaryPage = isSummaryPath(router.pathname);
  const dropdownLabel = `${user?.name}'s ${isSummaryPage ? 'Summary' : getAccountName(account)}`;

  const dropdownItems = useMemo(() => {
    if (!showAccountSelection(router.pathname) || !data?.accounts) {
      return [];
    }

    const existingAccounts = data?.accounts
      .filter((currentAccount) => isSummaryPage || currentAccount.id !== account.id)
      .map((currentAccount, index) => {
        return {
          key: String(index),
          label: (<Link href={`/accounts/${currentAccount.id}`}>{getAccountName(currentAccount)}</Link>)
        };
      });
    
    const items = [
      ...existingAccounts,
      {
        key: String(data.accounts.length),
        label: (<Link href="/new-account"><PlusOutlined /> Add account</Link>),
      }
    ];

    if (!isSummaryPage) {
      items.unshift({
        key: 'summary',
        label: (<Link href="/summary"><PieChartOutlined /> Summary</Link>),
      });
    }

    return items;
  }, [account, router.pathname, data?.accounts, isSummaryPage]);
  
  return (
    <header className={styles.header}>
      <div>
        Buckets
      </div>
      <div>
        {showAccountSelection(router.pathname) && user?.name &&
          <Dropdown menu={{ items: dropdownItems }}>
            <a onClick={(e) => e.preventDefault()}>
              {dropdownLabel}&nbsp;
              <DownOutlined />
            </a>
          </Dropdown>
        }
      </div>
      <div>
        {status === 'authenticated' && <Link href="/api/auth/signout">Sign out ({session?.user?.email})</Link>}
        {status !== 'authenticated' && <Link href="/api/auth/signin">Sign in</Link>}
      </div>
    </header>
  );
};
