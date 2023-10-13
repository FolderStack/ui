import md5 from "md5";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    debug: false,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token = Object.assign({}, token, { accessToken: account.access_token });
            }
            return token
        },
        async session({ session, token }) {
            if (session) {
                session.user = Object.assign({}, session.user, { id: token.sub })
                session = Object.assign({}, session, { accessToken: token.accessToken })
            }
            return session
        }
    },
    providers: [
        {
            id: 'australani',
            name: 'Australani',
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            type: "oauth",
            issuer: 'https://australani.whitepeak.digital/',
            jwks_endpoint: 'https://australani.whitepeak.digital?well-known=jwks',
            token: 'https://australani.whitepeak.digital/oauth/token',
            authorization: 'https://australani.whitepeak.digital/oauth/authorize',
            userinfo: {
                async request(context) {
                    const result = await fetch('https://australani.whitepeak.digital/oauth/me', {
                        headers: {
                            'Authorization': `Bearer ${context.tokens.access_token}`,
                        }
                    })

                    const data = await result.json();
                    return data as any;
                }
            },
            idToken: false,
            checks: ["pkce", "state"],
            profile(profile: any, tokens) {
                const emailhash = md5(profile?.user_email?.trim?.()?.toLowerCase?.() ?? '');
                return {
                    id: profile.sub,
                    name: profile.display_name,
                    email: profile.user_email,
                    image: emailhash.length ? 'https://gravatar.com/avatar/' + emailhash : null,
                    roles: profile.user_roles,
                    verified: profile.user_status === '1',
                    tokens
                }
            },
            client: {
                response_types: ["code"],
                client_id: process.env.OAUTH_CLIENT_ID,
                client_secret: process.env.OAUTH_CLIENT_SECRET,
                redirect_uris: ["http://localhost:3000/api/auth/callback/australani"],
                post_logout_redirect_uris: ["http://localhost:3000/"],
                token_endpoint_auth_method: "client_secret_basic",
                grant_types: ["authorization_code", "refresh_token", "client_credentials"],
                response_mode: "query",
                scope: "openid profile email basic",
                token_endpoint_auth_signing_alg: "RS256",
                introspection_endpoint_auth_method: "client_secret_basic",
                introspection_endpoint_auth_signing_alg: "RS256",
                revocation_endpoint_auth_method: "client_secret_basic",
                revocation_endpoint_auth_signing_alg: "RS256"
            },
        }
    ]
}