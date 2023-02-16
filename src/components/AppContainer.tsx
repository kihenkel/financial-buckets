import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useSession } from 'next-auth/react';
import isEqual from 'lodash/isEqual';
import { useAccountContext, useDataContext, useUserContext } from '@/context';
import { useData } from '@/hooks/useData';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Header } from './Header';

import styles from '@/styles/AppContainer.module.css';
import { Data } from '@/models';
import { Spin } from 'antd';
import { useRouter } from 'next/router';

const needsIntroduction = (data?: Data) => data && (!data.user.name || !data.accounts[0]?.name);

export interface PageProps {
  data: Data;
}

export const AppContainer = ({ Component, pageProps }: AppProps) => {
  const { status } = useSession({ required: true });
  const router = useRouter();
  const { data, isLoading, error, update, remove } = useData({ shouldLoad: status === 'authenticated' });
  const { user, setUser } = useUserContext();
  const { setUpdateData, setDeleteData } = useDataContext();
  const { account, setAccount } = useAccountContext();
  const { accountId } = router.query;

  useEffect(() => {
    const serverAccount = data?.accounts.find(account => account.id === accountId);
    if (serverAccount && !isEqual(account, serverAccount)) {
      setAccount(serverAccount);
    }
  }, [account, data, setAccount]);

  useEffect(() => {
    const isIntroductionNeeded = needsIntroduction(data);
    if (isIntroductionNeeded) {
      router.push('/introduction');
    }
  }, [data]);

  useEffect(() => {
    const serverUser = data?.user;
    if (serverUser && !isEqual(user, serverUser)) {
      setUser(serverUser);
    }
  }, [user, data, setUser]);

  useEffect(() => {
    setUpdateData(() => update);
    setDeleteData(() => remove);
  }, [update, remove, setUpdateData, setDeleteData]);

  return (
    <>
      <Header data={data} />
      <main className={styles.main}>
        { isLoading && !data && <div className={styles.spinner}><Spin size="large" /></div>}
        { !isLoading && error && <>Failed to load<div>{String(error)}</div></>}
        { data && <Component {...pageProps} data={data} />}
        <LoadingIndicator isLoading={isLoading} />
      </main>
    </>
  );
}
