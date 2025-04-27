# climbingtracker

Node backend with express. 

## Project Setup

Include a .env-file containing:

```sh
PORT=
PGUSER=
PGHOST=
PGDATABASE=
PGPASSWORD=
PGPORT=
PGSSL=true
PGSSLCA_PATH=./cert/ca.pem
JWT_SECRET=
```

db schema included in file [climbingtracker](climbingtracker)

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
DEBUG=ctbackend:* npm start
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

