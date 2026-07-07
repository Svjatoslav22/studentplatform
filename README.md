# studentplatform

Монорепозиторій для Student-Forum.

## Де дивитися документацію
- Основний README про застосунок: [Student-Forum/README.md](Student-Forum/README.md)
- Backend env template: [Student-Forum/server/.env.example](Student-Forum/server/.env.example)
- Frontend env template: [Student-Forum/client-side/.env.example](Student-Forum/client-side/.env.example)

## Як задеплоїти на Render
Оскільки тут окремо frontend і backend, найпростіше робити 2 сервіси:

1. Backend як Web Service.
   - Root Directory: `Student-Forum/server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `PORT`

2. Frontend як Static Site.
   - Root Directory: `Student-Forum/client-side`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Env var: `REACT_APP_API_URL` з URL backend-сервісу на Render

3. Після деплою frontend має вказувати на backend через `REACT_APP_API_URL`.

## Локальний запуск
- `npm run dev` з кореня `Student-Forum` запускає frontend і backend разом.
