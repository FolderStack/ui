import { isLocal } from "@/config/dev";
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
            }
            return token;
        },
        async session({ session, token }) {
            if (session) {
                session.user = Object.assign({}, session.user, token.user);
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
                  issuer: "https://url/",
                  jwks_endpoint: "https://url/.well-known/jwks",
                  token: "https://url/oauth/token",
                  authorization: "https://url/oauth/authorize",
                  userinfo: {
                      async request(context) {
                          const result = await fetch("https://url/oauth/me", {
                              headers: {
                                  Authorization: `Bearer ${context.tokens.access_token}`,
                              },
                          });

                          const data = await result.json();
                          return data as any;
                      },
                  },
                  idToken: false,
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
                          "http://localhost:3000/api/auth/callback/australani",
                      ],
                      post_logout_redirect_uris: ["http://localhost:3000/"],
                      token_endpoint_auth_method: "client_secret_basic",
                      grant_types: [
                          "authorization_code",
                          "refresh_token",
                          "client_credentials",
                      ],
                      response_mode: "query",
                      scope: "openid profile email basic",
                      token_endpoint_auth_signing_alg: "RS256",
                      introspection_endpoint_auth_method: "client_secret_basic",
                      introspection_endpoint_auth_signing_alg: "RS256",
                      revocation_endpoint_auth_method: "client_secret_basic",
                      revocation_endpoint_auth_signing_alg: "RS256",
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
