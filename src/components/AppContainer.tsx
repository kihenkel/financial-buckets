import { useEffect } from 'react';
import { message, Spin } from 'antd';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { useSession } from 'next-auth/react';
import isEqual from 'lodash/isEqual';
import { useAccountContext, useDataContext, useUserContext } from '@/context';
import { useData } from '@/hooks/useData';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Header } from './Header';

import styles from '@/styles/AppContainer.module.css';
import { Data } from '@/models';

const needsIntroduction = (data?: Data) => data && (!data.user.name || !data.accounts[0]?.name);

export interface PageProps {
  data: Data;
}

export const AppContainer = ({ Component, pageProps }: AppProps) => {
  const [messageApi, messageApiContext] = message.useMessage();
  const { status } = useSession({ required: true });
  const router = useRouter();
  const { data, isLoading, error, update, remove, importData } = useData({ shouldLoad: status === 'authenticated' });
  const { user, setUser } = useUserContext();
  const { setUpdateData, setDeleteData, setImportData } = useDataContext();
  const { account, setAccount } = useAccountContext();
  const { accountId } = router.query;

  useEffect(() => {
    const serverAccount = router.asPath.startsWith('/accounts') ?
      data?.accounts.find(account => account.id === accountId) :
      data?.accounts[0];
    if (serverAccount && !isEqual(account, serverAccount)) {
      setAccount(serverAccount);
    }
  }, [account, accountId, data, router.asPath, setAccount]);

  useEffect(() => {
    const isIntroductionNeeded = needsIntroduction(data);
    if (isIntroductionNeeded) {
      router.push('/introduction');
    }
  }, [data, router]);

  useEffect(() => {
    const serverUser = data?.user;
    if (serverUser && !isEqual(user, serverUser)) {
      setUser(serverUser);
    }
  }, [user, data, setUser]);

  useEffect(() => {
    setUpdateData(update);
    setDeleteData(remove);
    setImportData(importData);
  }, [update, remove, importData, setUpdateData, setDeleteData, setImportData]);

  useEffect(() => {
    if (error) {
      messageApi.error(String(error), 60);
    }
  }, [messageApi, error]);

  return (
    <>
      <Header data={data} />
      <main className={styles.main}>
        {messageApiContext}
        { isLoading && !data && <div className={styles.spinner}><Spin size="large" /></div>}
        { data && <Component {...pageProps} data={data} />}
        <LoadingIndicator isLoading={isLoading} />
      </main>
    </>
  );
};
