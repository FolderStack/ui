import { isLocal } from "@/config/dev";
import * as JWT from "jsonwebtoken";
import md5 from "md5";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    debug: false,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token = Object.assign({}, token, {
                    accessToken: account.access_token,
                });
            }
            if (user) {
                token.user = user;

                try {
                    const decoded = JWT.decode(
                        String((token as any).accessToken)
                    ) as Record<string, string | number>;

                    (token.user as any).role =
                        decoded.permissions === "*" ? "admin" : "user";
                } catch (err) {
                    //
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session) {
                session.user = Object.assign({}, session.user, token.user);
                session.user.orgId = process.env.ORG_ID!;
                session = Object.assign({}, session, {
                    accessToken: token.accessToken,
                });
            }
            return session;
        },
    },
    providers: [
        !isLocal
            ? {
                  id: "oauth",
                  name: "OAuth",
                  clientId: process.env.OAUTH_CLIENT_ID,
                  clientSecret: process.env.OAUTH_CLIENT_SECRET,
                  type: "oauth",
                  issuer: process.env.OAUTH_ISSUER,
                  jwks_endpoint: process.env.OAUTH_KEYS_ENDPOINT!,
                  token: process.env.OAUTH_TOKEN_ENDPOINT!,
                  authorization: process.env.OAUTH_AUTHORIZE_ENDPOINT!,
                  idToken: true,
                  checks: ["pkce", "state"],
                  profile(profile: any, tokens) {
                      const emailhash = md5(
                          profile?.user_email?.trim?.()?.toLowerCase?.() ?? ""
                      );
                      return {
                          id: profile.sub,
                          name: profile.display_name,
                          email: profile.user_email,
                          image: emailhash.length
                              ? "https://gravatar.com/avatar/" + emailhash
                              : null,
                          roles: profile.user_roles,
                          verified: profile.user_status === "1",
                          tokens,
                      };
                  },
                  client: {
                      response_types: ["code"],
                      client_id: process.env.OAUTH_CLIENT_ID,
                      client_secret: process.env.OAUTH_CLIENT_SECRET,
                      redirect_uris: [
                          `${process.env.NEXTAUTH_URL}/api/auth/callback/oauth`,
                      ],
                      post_logout_redirect_uris: [
                          process.env.OAUTH_LOGOUT_URL ??
                              process.env.NEXTAUTH_URL!,
                      ],
                  },
              }
            : CredentialsProvider({
                  id: "credentials",
                  // The name to display on the sign in form (e.g. "Sign in with...")
                  name: "Credentials",
                  // `credentials` is used to generate a form on the sign in page.
                  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
                  // e.g. domain, username, password, 2FA token, etc.
                  // You can pass any HTML attribute to the <input> tag through the object.
                  credentials: {
                      username: {
                          label: "Username",
                          type: "text",
                          placeholder: "jsmith",
                      },
                      password: { label: "Password", type: "password" },
                  },
                  async authorize() {
                      return {
                          id: "1",
                          name: "Tester",
                          email: "test@folderstack.io",
                          orgId: "652dffaeb273b18cf0d23762",
                          role: "admin",
                      };
                  },
              }),
    ],
};

export const authHandler = NextAuth(authOptions);
