# Deploying Makaam Frontend to Netlify

This guide will help you deploy your Makaam frontend to Netlify, connecting to your backend at https://makaam11.onrender.com.

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. Your Makaam codebase pushed to a GitHub repository

## Deployment Steps

### 1. Prepare Your Repository

1. Commit all the changes we've made to your frontend:
   ```
   cd c:\Users\laksh\Makaam1-10
   git add frontend/
   git commit -m "Prepare frontend for Netlify deployment"
   git push origin main
   ```

### 2. Deploy to Netlify

#### Option 1: Deploy via Netlify UI

1. Log in to your [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Configure the build settings:
   - **Base directory**: `frontend` (important: specify this to tell Netlify where your frontend code is)
   - **Build command**: `npm run build`
   - **Publish directory**: `build` (or `frontend/build` if you didn't set the base directory)
5. Click "Advanced build settings" and add the environment variable:
   - `REACT_APP_API_URL`: `https://makaam11.onrender.com`
6. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI if you haven't already:
   ```
   npm install -g netlify-cli
   ```

2. Navigate to your frontend directory:
   ```
   cd c:\Users\laksh\Makaam1-10\frontend
   ```

3. Login to Netlify:
   ```
   netlify login
   ```

4. Initialize and deploy your site:
   ```
   netlify init
   netlify deploy --prod
   ```

### 3. Verify Your Deployment

1. Once deployed, Netlify will provide you with a URL for your frontend (e.g., `https://makaam.netlify.app`)
2. Visit the URL to ensure your application loads correctly
3. Test user registration, login, and roadmap generation to verify the connection to your backend

## Troubleshooting

- **API Connection Issues**: Check the browser console for any CORS errors or failed API requests
- **Routing Issues**: Make sure the `_redirects` file is in your `public` directory
- **Build Failures**: Check the Netlify build logs for specific errors
- **Environment Variables**: Verify that `REACT_APP_API_URL` is set correctly

## Custom Domain (Optional)

1. In your Netlify dashboard, go to "Site settings" → "Domain management"
2. Click "Add custom domain" and follow the instructions to set up your domain

## Continuous Deployment

Netlify automatically sets up continuous deployment from your GitHub repository. Any changes pushed to your main branch will trigger a new deployment.
