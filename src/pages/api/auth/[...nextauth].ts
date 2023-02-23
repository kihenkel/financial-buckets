import NextAuth, { AuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

export const authOptions: AuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      issuer: process.env.AUTH0_ISSUER,
    })
  ],
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