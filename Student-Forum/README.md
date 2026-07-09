# Student-Forum
Платформа для взаємодії студентів Самбірського фахового коледжу інформатики. 

## Setup
1. Install dependencies in the root, `client-side`, and `server` folders.
2. Create `server/.env` from `server/.env.example`.
3. Create `client-side/.env` from `client-side/.env.example`.

### Environment variables
**`server/.env` (Local Development):**
- `DB_HOST=localhost`
- `DB_USER=root`
- `DB_PASSWORD=your_password`
- `DB_NAME=student_platform`
- `DB_PORT=3306`
- `PORT=5000`
- `CLIENT_URL=http://localhost:3000` (Required for CORS)

**`client-side/.env` (Local Development):**
- `REACT_APP_API_URL=http://localhost:5000`

*Note: For production deployment, ensure these variables are updated in your hosting provider's dashboard (Render for Backend, Vercel for Frontend).*

### Run
- `npm run dev` from the project root to start both apps together.
- `npm run start-server` to start only the backend.
- `npm run start-client` to start only the frontend.

## Stack⚡
### Frontend
- React
- Material UI
- SCSS/SASS
- React Icons
### Backend
- Nodejs
- Expressjs
- MySQL (Aiven Cloud)
- Socket-io

## Preview🔎
### Welcome Page
![welcome](./ReadmeAssets/Welcome.png)

### Rest
![Preview](https://user-images.githubusercontent.com/60890818/168035861-9843cbd6-266a-48a9-9645-0e51a575d110.gif)