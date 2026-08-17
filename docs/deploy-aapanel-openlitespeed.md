# Deploy to aaPanel + OpenLiteSpeed

Target:

- Domain: `pemulabet.com`
- Server IP: `159.65.130.3`
- App port: `127.0.0.1:3000`
- Admin app port: `127.0.0.1:3001`
- Repo: `https://github.com/kdbdevs/agenolx.git`

## DNS

Point DNS records to the server:

```dns
pemulabet.com.      A      159.65.130.3
www.pemulabet.com.  CNAME  pemulabet.com.
```

Wait until:

```bash
dig +short pemulabet.com A
dig +short www.pemulabet.com A
```

returns `159.65.130.3`.

## Server Packages

Next.js 16 requires Node.js `>=20.9.0`. Use Node 22 LTS.

Install with aaPanel Node.js manager, or from SSH:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs git
npm install -g pm2
node -v
npm -v
```

## Database

Create a MySQL database and user in aaPanel:

- Database: `agenolx`
- User: `agenolx`
- Password: use a strong generated password

Grant the user access to the database.

## App Files

```bash
mkdir -p /www/wwwroot
cd /www/wwwroot
git clone https://github.com/kdbdevs/agenolx.git pemulabet.com
cd /www/wwwroot/pemulabet.com
npm ci
```

Create the production env file:

```bash
cp .env.example .env.production
nano .env.production
```

Use production values:

```env
DATABASE_URL="mysql://agenolx:CHANGE_DATABASE_PASSWORD@127.0.0.1:3306/agenolx"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_DATABASE="agenolx"
MYSQL_USER="agenolx"
MYSQL_PASSWORD="CHANGE_DATABASE_PASSWORD"
SESSION_SECRET="CHANGE_WITH_OPENSSL_RAND_HEX_32"
ADMIN_USERNAME="CHANGE_ADMIN_USERNAME"
ADMIN_PASSWORD="CHANGE_STRONG_ADMIN_PASSWORD"
```

Generate `SESSION_SECRET`:

```bash
openssl rand -hex 32
```

Apply schema and build:

```bash
npm run db:check
npm run db:schema
npm run admin:create
npm run build
```

## PM2

Start the app:

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 status
```

The PM2 config starts:

- `pemulabet` on `127.0.0.1:3000`
- `pemulabet-admin` on `127.0.0.1:3001`

Enable PM2 on boot:

```bash
pm2 startup
```

Run the command that PM2 prints, then:

```bash
pm2 save
```

## aaPanel Website + Reverse Proxy

In aaPanel:

1. Website -> Add site
2. Domain: `pemulabet.com`
3. Also add: `www.pemulabet.com`
4. PHP: Static or Pure static
5. Root path: `/www/wwwroot/pemulabet.com`

Then add a reverse proxy:

- Proxy name: `agenolx_next`
- Target URL: `http://127.0.0.1:3000`
- Sent domain: `$host`
- Cache: off

For the admin subdomain, add `admin.pemulabet.com` and proxy it to:

- Proxy name: `pemulabet_admin`
- Target URL: `http://127.0.0.1:3001`
- Sent domain: `$host`
- Cache: off

The app redirects `/` to `/admin` automatically when accessed through an `admin.*` hostname or port `3001`.

If using OpenLiteSpeed rewrite instead of aaPanel reverse proxy, route all traffic to the Node process:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L,E=PROXY-HOST:127.0.0.1]
```

Restart OpenLiteSpeed from aaPanel after changing vhost/reverse proxy settings.

## SSL

After DNS points to `159.65.130.3`:

1. aaPanel -> Website -> `pemulabet.com` -> SSL
2. Choose Let's Encrypt
3. Select `pemulabet.com` and `www.pemulabet.com`
4. Enable Force HTTPS after the certificate is issued

## Update Deploy

```bash
cd /www/wwwroot/pemulabet.com
git pull
npm ci
npm run db:schema
npm run admin:create
npm run build
pm2 restart pemulabet pemulabet-admin
pm2 save
```

## Health Checks

```bash
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:3001/admin
curl -I http://pemulabet.com
pm2 logs pemulabet --lines 80
pm2 logs pemulabet-admin --lines 80
```
