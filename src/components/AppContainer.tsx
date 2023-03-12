import { useEffect } from 'react';
import { message, Spin } from 'antd';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { useSession } from 'next-auth/react';
import isEqual from 'lodash/isEqual';
import { useAccountContext, useDataContext, useNotificationContext, useUserContext } from '@/context';
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
  const { data, isLoading, isStale, error, update, remove, importData, optimizeBucket, forceUpdate, reset } = useData({ shouldLoad: status === 'authenticated' });
  const { user, setUser } = useUserContext();
  const { setUpdateData, setDeleteData, setImportData, setOptimizeBucket } = useDataContext();
  const { error: errorMessage, setError: setErrorMessage, warning: warningMessage, info: infoMessage } = useNotificationContext();
  const { account, setAccount } = useAccountContext();
  const { accountId } = router.query;

  useEffect(() => {
    const serverAccount = router.asPath.startsWith('/accounts') ?
      data?.accounts.find(account => account.id === accountId) :
      data?.accounts[0];
    if (serverAccount && !isEqual(account, serverAccount)) {
      setAccount(serverAccount);
      if (account.userId && account.id !== serverAccount.id) {
        reset();
      }
    }
  }, [account, accountId, data, router.asPath, setAccount, reset]);

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
    if (!isStale) {
      window.onbeforeunload = function() {};
      return;
    }
    window.onbeforeunload = function() { return 'You have unsaved changes!'; };

    return () => {
      window.onbeforeunload = function() {};
    };
  }, [isStale]);

  useEffect(() => {
    setUpdateData(update);
    setDeleteData(remove);
  }, [update, remove, setUpdateData, setDeleteData]);

  useEffect(() => {
    setImportData(importData);
    setOptimizeBucket(optimizeBucket);
  }, [importData, optimizeBucket, setImportData, setOptimizeBucket]);

  useEffect(() => {
    if (error) {
      setErrorMessage(String(error));
    }
  }, [error, setErrorMessage]);

  useEffect(() => {
    if (errorMessage) {
      messageApi.error(errorMessage, Math.ceil(errorMessage.length / 3));
    }
  }, [messageApi, errorMessage]);

  useEffect(() => {
    if (warningMessage) {
      messageApi.warning(warningMessage, Math.ceil(warningMessage.length / 3));
    }
  }, [messageApi, warningMessage]);

  useEffect(() => {
    if (infoMessage) {
      messageApi.info(infoMessage, Math.ceil(infoMessage.length / 3));
    }
  }, [messageApi, infoMessage]);

  return (
    <>
      <Header data={data} />
      <main className={styles.main}>
        {messageApiContext}
        { isLoading && !data && <div className={styles.spinner}><Spin size="large" /></div>}
        { data && <Component {...pageProps} data={data} />}
        <LoadingIndicator isLoading={isLoading} isStale={isStale} onStaleClicked={forceUpdate} />
      </main>
    </>
  );
};
