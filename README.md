# Linkhub - Link Sharing Platform
 
A full-stack link sharing platform with MySQL backend and React frontend.
 
## Features
- User authentication (register/login)
- Custom profile pages with avatar
- Link management (add, edit, delete, reorder)
- Drag-and-drop link ordering
- Professional dashboard UI
 
## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MySQL
- **Authentication**: JWT
 
## Setup
 
### Backend
```bash
cd Linkhub
npm install
# Make sure MySQL is running with:
# host: localhost, user: appusers, password: 123mine, database: clientinfo
node Linkhubdb
```
 
### Frontend
```bash
cd Linkhub/link-sharing-frontend
npm install
npm run dev
```
 
## Environment Variables
Create `.env` in Linkhub folder:
```
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```