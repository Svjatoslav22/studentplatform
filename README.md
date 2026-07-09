# studentplatform

Монорепозиторій для Student-Forum.

## Де дивитися документацію
- Основний README про застосунок: [Student-Forum/README.md](Student-Forum/README.md)
- Backend env template: [Student-Forum/server/.env.example](Student-Forum/server/.env.example)
- Frontend env template: [Student-Forum/client-side/.env.example](Student-Forum/client-side/.env.example)

## Як задеплоїти платформу (Production)
Проект має розділену (decoupled) архітектуру. Бекенд та фронтенд розгортаються на різних сервісах:

### 1. Backend (Render - Web Service)
- **Root Directory:** `Student-Forum/server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:** - База даних (Aiven MySQL): `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
  - Сервер: `PORT` (зазвичай 10000)
  - CORS: `CLIENT_URL` (URL розгорнутого фронтенду на Vercel, без `/` в кінці)

### 2. Frontend (Vercel)
- **Root Directory:** `Student-Forum/client-side`
- **Framework Preset:** Create React App
- **Environment Variables:**
  - `REACT_APP_API_URL`: URL вашого backend-сервісу на Render (напр., `https://studentplatform-u967.onrender.com`)
  - `CI`: `false` (для ігнорування ворнінгів лінтера при збірці)
  - `NODE_OPTIONS`: `--openssl-legacy-provider` (для сумісності Webpack з новими версіями Node.js)

## Локальний запуск
- `npm run dev` з кореня `Student-Forum` запускає frontend і backend разом.