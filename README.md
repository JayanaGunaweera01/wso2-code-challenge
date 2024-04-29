# NextJS Sample app

- Built with Next JS & next-auth

```
    npm install
    npm run dev
```

### Auth provider configurations

Callback url - https://next-auth.js.org/configuration/providers/oauth#how-to
`[origin]/api/auth/callback/[provider]`

### ENV Configurations

#### URL of the web application - provided to next-auth to generate callback urls

https://next-auth.js.org/configuration/options#nextauth_url

```env
NEXTAUTH_URL=http://localhost:3000
```

#### Secret used to encrypt the NextAuth.js JWT,

https://next-auth.js.org/configuration/options#secret

```env
# openssl rand -base64 32
SECRET=
```

#### clientId & secret for your asgardeo application

```env
ASGARDEO_CLIENT_ID=
ASGARDEO_CLIENT_SECRET=
```

#### asgarder server

```env
# https://api.asgardeo.io/t/[organization]
ASGARDEO_SERVER_ORIGIN=https://api.asgardeo.io/t/webappsdemo
```

#### other configurations

```env
TODO_API_BASE_URL=http://localhost:8080
ENV_NAME=<to display deployed environment>
```
