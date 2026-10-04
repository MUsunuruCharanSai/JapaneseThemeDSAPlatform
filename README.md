# CodeArena

Live app: [https://dsa-sheet-online.vercel.app/login](https://dsa-sheet-online.vercel.app/login)

A DSA practice sheet with login, admin controls, and payments. Frontend is React (Vite). Backend is Express with Firebase.

## Setup

You need Node.js installed.

```bash
git clone https://github.com/MUsunuruCharanSai/JapaneseThemeDSAPlatform.git
cd JapaneseThemeDSAPlatform
```

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` and add:

```
PORT=5000
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
ADMIN_EMAIL=
FRONTEND_URL=http://localhost:3000
```

Get the Firebase values from Firebase Console → Project settings → Service accounts.

Start the API:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` and add:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=
```

Get the `VITE_FIREBASE_*` values from Firebase Console → Project settings → Your apps.

Start the app:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 3. Open the app

Go to [http://localhost:3000/login](http://localhost:3000/login).

The email in `ADMIN_EMAIL` / `VITE_ADMIN_EMAIL` is the admin account.
