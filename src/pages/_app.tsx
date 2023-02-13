import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { ContextProviders } from '@/context';

import '@/styles/globals.css';
import { AppContainer } from '@/components/AppContainer';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
          <title>Buckets</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ContextProviders>
          <style jsx global>{`
            html {
              font-family: ${inter.style.fontFamily};
            }
          `}
          </style>
          <AppContainer Component={Component} {...pageProps} />
        </ContextProviders>
      </SessionProvider>
    </>
  );
}
