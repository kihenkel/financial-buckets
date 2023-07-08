import { useEffect } from 'react';
import { notification, Spin } from 'antd';
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
  const [notificationApi, notificationApiContext] = notification.useNotification();
  const { status } = useSession({ required: true });
  const router = useRouter();
  const {
    data,
    isLoading,
    isStale,
    error,
    update,
    remove,
    importData,
    optimizeBucket,
    optimizeAllBuckets,
    forceUpdate,
    reset,
  } = useData({ shouldLoad: status === 'authenticated' });
  const { user, setUser } = useUserContext();
  const { setUpdateData, setDeleteData, setImportData, setOptimizeBucket, setOptimizeAllBuckets } = useDataContext();
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
    if (isIntroductionNeeded && router.asPath !== '/introduction') {
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
    setOptimizeAllBuckets(optimizeAllBuckets);
  }, [importData, optimizeBucket, optimizeAllBuckets, setImportData, setOptimizeBucket, setOptimizeAllBuckets]);

  useEffect(() => {
    if (error) {
      setErrorMessage(String(error));
    }
  }, [error, setErrorMessage]);

  useEffect(() => {
    if (errorMessage) {
      notificationApi.error({
        message: 'Error',
        description: errorMessage,
        duration: 0,
      });
    }
  }, [notificationApi, errorMessage]);

  useEffect(() => {
    if (warningMessage) {
      notificationApi.warning({
        message: 'Warning',
        description: warningMessage,
        duration: 0,
      });
    }
  }, [notificationApi, warningMessage]);

  useEffect(() => {
    if (infoMessage) {
      notificationApi.info({
        message: 'Info',
        description: infoMessage,
        duration: 0,
      });
    }
  }, [notificationApi, infoMessage]);

  return (
    <>
      <Header data={data} />
      <main className={styles.main}>
        {notificationApiContext}
        { isLoading && !data && <div className={styles.spinner}><Spin size="large" /></div>}
        { data && <Component {...pageProps} data={data} />}
        <LoadingIndicator isLoading={isLoading} isStale={isStale} onStaleClicked={forceUpdate} />
      </main>
    </>
  );
};
