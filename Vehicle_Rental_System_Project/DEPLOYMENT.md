# Vehicle Rental System - Deployment Guide

## Quick Setup

### Backend (Render)
1. Deploy to Render
2. Add Environment Variables:
   - `MONGO_URI` - MongoDB Atlas connection
   - `JWT_SECRET` - Any secret key
   - `CLOUDINARY_CLOUD_NAME` - From cloudinary.com
   - `CLOUDINARY_API_KEY` - From cloudinary.com
   - `CLOUDINARY_API_SECRET` - From cloudinary.com

### Frontend (Vercel)
1. Deploy to Vercel
2. Add Environment Variable:
   - `REACT_APP_API_URL` - Your backend URL + /api

### Cloudinary Setup (For Images)
1. Sign up: https://cloudinary.com/users/register_free
2. Get credentials from dashboard
3. Add to Render environment variables

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Storage: Cloudinary (images)
