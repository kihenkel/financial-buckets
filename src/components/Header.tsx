import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Dropdown } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';

import styles from '@/styles/Layout.module.css';
import { useAccountContext, useUserContext } from '@/context';
import { useRouter } from 'next/router';
import { Data } from '@/models';

const showAccountSelection = (pathname: string) => pathname.startsWith('/accounts');

interface HeaderProps {
  data?: Data;
}

export const Header = ({ data }: HeaderProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { account } = useAccountContext();
  const { user } = useUserContext();

  const dropdownItems = useMemo(() => {
    if (!showAccountSelection(router.pathname) || !data?.accounts) {
      return [];
    }

    const existingAccounts = data?.accounts
      .filter((currentAccount) => currentAccount.id !== account.id)
      .map((currentAccount, index) => {
        return {
          key: String(index),
          label: (<Link href={`/accounts/${currentAccount.id}`}>{currentAccount.name}</Link>)
        };
      });

    return [
      ...existingAccounts,
      {
        key: String(data.accounts.length),
        label: (<Link href="/new-account"><PlusOutlined /> Add account</Link>),
      }
    ];
  }, [account, router.pathname, data?.accounts]);
  
  return (
    <header className={styles.header}>
      <div>
        Buckets
      </div>
      <div>
        {showAccountSelection(router.pathname) && user?.name && account.name &&
          <Dropdown menu={{ items: dropdownItems }}>
            <a onClick={(e) => e.preventDefault()}>
              {`${user?.name}'s ${account.name}`}&nbsp;
              <DownOutlined />
            </a>
          </Dropdown>
        }
      </div>
      <div>
        {status === "authenticated" && <Link href="/api/auth/signout">Sign out ({session?.user?.email})</Link>}
        {status !== "authenticated" && <Link href="/api/auth/signin">Sign in</Link>}
      </div>
    </header>
  );
};
