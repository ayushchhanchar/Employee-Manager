# Employee Management System - Setup Guide

## Backend Dependencies

### Core Dependencies
```bash
cd BackEnd
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator multer nodemailer passport passport-google-oauth20 express-session cookie-parser cloudinary
```

### Individual Package Installation
```bash
# Core Framework & Database
npm install express@^4.21.1
npm install mongoose@^8.16.2

# Authentication & Security
npm install bcryptjs@^2.4.3
npm install jsonwebtoken@^9.0.2
npm install passport@^0.7.0
npm install passport-google-oauth20@^2.0.0
npm install express-session@^1.18.1
npm install cookie-parser@^1.4.7

# Middleware & Utilities
npm install cors@^2.8.5
npm install dotenv@^16.6.1
npm install express-validator@^7.2.1

# File Upload & Email
npm install multer@^2.0.1
npm install nodemailer@^7.0.5
npm install cloudinary@^2.7.0
```

## Frontend Dependencies

### Core Dependencies
```bash
cd FrontEnd
npm install react@^18.3.1 react-dom@^18.3.1 react-router-dom@^6.26.2 recoil@^0.7.7 axios@^1.7.7
```

### UI & Styling
```bash
npm install antd@^5.21.1 tailwindcss@^3.4.11 autoprefixer@^10.4.20 postcss@^8.4.47
```

### Icons & Components
```bash
npm install @heroicons/react@^2.2.0 react-icons@^5.3.0 react-pro-sidebar@^1.1.0
```

### Additional Features
```bash
npm install react-calendar@^5.0.0 react-spinners@^0.14.1 react-timer-hook@^3.0.7 recharts@^3.0.2
```

### Development Dependencies
```bash
npm install --save-dev @vitejs/plugin-react@^4.3.1 @eslint/js@^9.9.0 eslint@^9.9.0 eslint-plugin-react@^7.35.0 eslint-plugin-react-hooks@^5.1.0-rc.0 eslint-plugin-react-refresh@^0.4.9 globals@^15.9.0 vite@^5.4.1
```

## Environment Setup

### Backend Environment (.env)
Create a `.env` file in the BackEnd directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/employee_management

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Session
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
```

### Frontend Environment (.env)
Create a `.env` file in the FrontEnd directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Database Setup

### MongoDB Installation
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

## How to Start the Application

### 1. Start Backend Server
```bash
cd BackEnd
npm start
# or for development with auto-restart
npm run dev
```
The backend will run on `http://localhost:5000`

### 2. Start Frontend Development Server
```bash
cd FrontEnd
npm run dev
```
The frontend will run on `http://localhost:5173`

## Complete Installation Script

### Backend Setup
```bash
cd BackEnd
npm install
cp .env.example .env
# Edit .env file with your configuration
npm start
```

### Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```

## Package Scripts

### Backend Scripts
Add these to `BackEnd/package.json`:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Frontend Scripts (already configured)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (for API testing)

### API Testing
Use Postman or Thunder Client to test backend endpoints:
- Base URL: `http://localhost:5000/api`
- Authentication endpoints: `/auth/login`, `/auth/register`
- Employee endpoints: `/employees`
- Attendance endpoints: `/attendance`

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Ensure MongoDB is running
2. **CORS Issues**: Check frontend URL in backend CORS configuration
3. **Port Already in Use**: Change PORT in .env file
4. **JWT Token Issues**: Verify JWT_SECRET is set in .env

### Reset Database
```bash
# Connect to MongoDB
mongo
use employee_management
db.dropDatabase()
```

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use PM2 for process management
3. Set up reverse proxy with Nginx
4. Use MongoDB Atlas for database

### Frontend
1. Build the application: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Update API base URL for production