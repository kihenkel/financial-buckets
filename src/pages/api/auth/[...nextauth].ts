import logger from '@/server/logger';
import NextAuth, { AuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';
import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';

const providers: Provider[] = [Auth0Provider({
  clientId: process.env.AUTH0_CLIENT_ID ?? '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
  issuer: process.env.AUTH0_ISSUER,
})];

if (process.env.NODE_ENV === 'development') {
  logger.warning('Development environment: Using local test auth provider');
  const LocalTestProvider = CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize() {
      return {
        id: 'localUserId',
        email: 'local@test.com',
        name: 'LocalUser'
      };
    }
  });
  providers.push(LocalTestProvider);
}

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.sub ?? 'MISSING_ID',
          email: session.user?.email,
          name: session.user?.name,
        }
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);