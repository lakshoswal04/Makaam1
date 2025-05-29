# Deploying Makaam to Render

This guide will walk you through deploying your Makaam application to Render.

## Prerequisites

1. A [Render](https://render.com) account
2. Your Makaam codebase pushed to a GitHub repository

## Deployment Steps

### 1. Prepare Your Environment Variables

You'll need to set up the following environment variables in Render:

- `JWTPRIVATEKEY`: Your JWT private key for authentication
- `MONGO_URI`: Your MongoDB connection string
- `GROQ_API_KEY`: Your Groq API key
- `NODE_ENV`: Set to "production"

### 2. Deploy the Backend

1. Log in to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `makaam-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node index.js`
   - **Add the environment variables** mentioned above

### 3. Deploy the Frontend

1. In your Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `makaam-web`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: The URL of your backend service (e.g., `https://makaam-api.onrender.com`)

### 4. Configure Redirects for the Frontend

Add a `_redirects` file in your `frontend/public` directory with the following content:

```
/*  /index.html  200
```

This ensures that React Router works correctly with client-side routing.

### 5. Test Your Deployment

Once both services are deployed:

1. Visit your frontend URL (e.g., `https://makaam-web.onrender.com`)
2. Test user registration, login, and roadmap generation
3. Check that the roadmap data is properly stored in MongoDB

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, make sure your backend's CORS configuration includes your frontend's URL
- **Database Connection**: Verify that your MongoDB connection string is correct and the database is accessible from Render
- **Environment Variables**: Double-check that all required environment variables are set correctly

## Monitoring

- Use Render's logs to monitor your application
- Set up alerts for any service disruptions
