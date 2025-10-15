# HireMind Deployment Guide

This guide provides step-by-step instructions for deploying the HireMind application to various hosting platforms.

## Prerequisites

1. **OpenRouter API Key**: Get your API key from [OpenRouter](https://openrouter.ai/)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Create `.env` files with your API keys

## Frontend Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Select the root directory (not backend)

2. **Configure Environment Variables in Vercel Dashboard**:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables" section
   - Add `VITE_API_URL` with your backend URL (e.g., `https://your-backend.onrender.com`)
   - Add `VITE_OPENROUTER_API_KEY` with your OpenRouter API key

3. **Deploy**:
   - Vercel will automatically build and deploy
   - Your frontend will be available at `https://your-app.vercel.app`

### Option 2: Netlify

1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com/)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Configure Environment Variables**:
   - Add `VITE_API_URL` with your backend URL
   - Add `VITE_OPENROUTER_API_KEY` with your OpenRouter API key

## Backend Deployment Options

### Option 1: Render (Recommended for Free Tier)

1. **Connect Repository**:
   - Go to [Render](https://render.com/)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set root directory to `backend`

2. **Configure Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `FRONTEND_URL`: Your frontend URL (e.g., https://your-app.vercel.app)

### Option 2: Railway

1. **Deploy from GitHub**:
   - Go to [Railway](https://railway.app/)
   - Deploy from GitHub repository
   - Select the `backend` folder

2. **Environment Variables**:
   - Add the same variables as listed for Render

### Option 3: Heroku

1. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**:
   ```bash
   heroku config:set OPENROUTER_API_KEY=your_key_here
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

3. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Complete Deployment Steps

### Step 1: Deploy Backend First

1. Choose a backend hosting platform (Render recommended)
2. Deploy your backend and note the URL (e.g., `https://your-backend.onrender.com`)
3. Set environment variables in your backend hosting platform:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FRONTEND_URL`: `https://hiremindcom.vercel.app` (your frontend URL)

### Step 2: Deploy Frontend

1. Update your frontend environment variables in Vercel dashboard:
   - Set `VITE_API_URL` to your **deployed backend URL** (NOT localhost)
   - Set `VITE_OPENROUTER_API_KEY` to your OpenRouter API key
2. Deploy to Vercel or Netlify

### Step 3: Update CORS Settings

The backend is already configured to accept requests from `https://hiremindcom.vercel.app`. Make sure your backend CORS configuration includes your frontend domain.

## Environment Variables Reference

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Backend (.env)
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend CORS settings include your frontend domain
2. **API Key Issues**: Verify your OpenRouter API key is correctly set
3. **Build Failures**: Check that all dependencies are listed in package.json
4. **Environment Variables**: Ensure all required environment variables are set

### Health Check

Your backend includes a health check endpoint at `/health` that you can use to verify deployment.

## Security Notes

- Never commit `.env` files to your repository
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Enable HTTPS for production deployments

## Support

If you encounter issues:
1. Check the deployment logs on your hosting platform
2. Verify all environment variables are set correctly
3. Test your API endpoints manually
4. Ensure your OpenRouter API key has sufficient credits