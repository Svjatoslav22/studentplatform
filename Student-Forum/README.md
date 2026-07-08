# Student-Forum
A platform to engage students of UET Lahore

## Setup
1. Install dependencies in the root, `client-side`, and `server` folders.
2. Create `server/.env` from `server/.env.example`.
3. Create `client-side/.env` from `client-side/.env.example`.

### Environment variables
`server/.env`:
- `DB_HOST=localhost`
- `DB_USER=root`
- `DB_PASSWORD=your_password`
- `DB_NAME=student_platform`
- `DB_PORT=3306`
- `PORT=5000`

`client-side/.env`:
- `REACT_APP_API_URL=http://localhost:5000`
- For Render deployment, set `REACT_APP_API_URL=https://studentplatform-u967.onrender.com`

`client-side/.env.example` shows both local and production values as a reference.

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
- MySQL
- Socket-io

## Preview🔎
### Welcome Page
![welcome](./ReadmeAssets/Welcome.png)

### Rest
![WhatsApp-Video-2022-05-12-at-2 09 17-PM](https://user-images.githubusercontent.com/60890818/168035861-9843cbd6-266a-48a9-9645-0e51a575d110.gif)
