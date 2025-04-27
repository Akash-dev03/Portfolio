# Portfolio Project Deployment Guide

This project is deployed across three platforms:

## 🌐 Frontend (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Select the `frontend` directory as the root directory
5. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL

## ⚙️ Backend (Render)

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - Name: `portfolio-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `NODE_ENV`: `production`
   - Add any other environment variables from your .env file

## 🗄️ Database (Supabase)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your PostgreSQL connection string from Settings > Database
4. Update your `DATABASE_URL` in Render with this connection string
5. Run migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

## 🔄 Keeping the Backend Alive

To prevent the free Render instance from sleeping:
1. Set up a cron job or use a service like UptimeRobot
2. Ping your backend URL every 5-10 minutes

## 🔗 Connecting Everything

1. After deploying the backend to Render, get the URL (e.g., `https://your-app.onrender.com`)
2. Add this URL as `VITE_API_URL` in your Vercel frontend environment variables
3. Update CORS settings in your backend if necessary

## 📝 Post-Deployment

1. Test the complete flow from frontend to backend to database
2. Monitor the logs in both Vercel and Render
3. Set up any necessary monitoring or alerting 