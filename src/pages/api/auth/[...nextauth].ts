import NextAuth, { AuthOptions } from "next-auth";

// https://next-auth.js.org/getting-started/rest-api
// https://next-auth.js.org/configuration/options
export const authOptions: AuthOptions = {
  providers: [
    {
      // https://next-auth.js.org/configuration/providers/oauth#using-a-custom-provider
      id: "asgardeo",
      name: "Asgardeo",
      type: "oauth",
      clientId: process.env.ASGARDEO_CLIENT_ID,
      clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
      wellKnown: `${process.env.ASGARDEO_SERVER_ORIGIN}/oauth2/token/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile?.sub,
          name: profile?.given_name,
          email: profile?.email,
        };
      },
      httpOptions: {
        timeout: 40000,
      },
    },
  ],
  secret: process.env.SECRET,

  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        // Persist the OAuth access_token to the token right after signin
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // Send properties to the client, like an access_token from a provider.
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
  },
  debug: true,
};
export default NextAuth(authOptions);
