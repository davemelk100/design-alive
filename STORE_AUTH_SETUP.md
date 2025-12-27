# Store Authentication Setup Guide

This guide explains how to set up Google OAuth authentication for the store section of the application.

## Overview

The store uses Google OAuth for authentication. Users must sign in with Google to access store pages (product listings, product details, checkout, etc.).

## Environment Variables

Add the following environment variables to your Netlify dashboard (Site settings > Environment variables):

### Required Variables

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth Redirect URI (should match your Netlify function URL)
GOOGLE_REDIRECT_URI=https://your-site.netlify.app/.netlify/functions/auth-login

# JWT Secret (for signing authentication tokens)
JWT_SECRET=your-secret-key-here-minimum-32-characters

# Database URL (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Base URL (usually set automatically by Netlify)
URL=https://your-site.netlify.app
```

## Setting Up Google OAuth

### Step-by-Step Guide:

1. **Go to Google Cloud Console**:

   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**:

   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Give it a name (e.g., "My Store Auth")
   - Click "Create"

3. **Configure OAuth Consent Screen** (Required first):

   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace)
   - Click "Create"
   - Fill in:
     - **App name**: Your store name (e.g., "BALM Store")
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click "Save and Continue"
   - On "Scopes" page, click "Save and Continue" (default scopes are fine)
   - On "Test users" page, add your email if testing, then "Save and Continue"
   - Review and "Back to Dashboard"

4. **Create OAuth 2.0 Credentials**:

   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "OAuth client ID"
   - Choose "Web application" as the application type
   - Give it a name (e.g., "Store OAuth Client")
   - **Authorized JavaScript origins** (add these):
     - `http://localhost:5173` (for local development)
     - `https://your-site.netlify.app` (for production - replace with your actual domain)
   - **Authorized redirect URIs** (add these):
     - `http://localhost:5173/.netlify/functions/auth-login` (for local development)
     - `https://your-site.netlify.app/.netlify/functions/auth-login` (for production)
   - Click "CREATE"
   - **IMPORTANT**: Copy the **Client ID** and **Client Secret** immediately (you won't see the secret again!)

5. **Add to Environment Variables**:
   - Add these to your `.env` file (for local development):
     ```
     GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-client-secret-here
     GOOGLE_REDIRECT_URI=http://localhost:5173/.netlify/functions/auth-login
     JWT_SECRET=your-random-secret-key-here-minimum-32-characters
     DATABASE_URL=your-database-url
     ```
   - Add the same to Netlify environment variables (for production):
     - Go to your Netlify site dashboard
     - Site settings > Environment variables
     - Add each variable (update GOOGLE_REDIRECT_URI to your production URL)

## Database Migration

The authentication system requires updates to the `users` table. Run the database migration:

```bash
npm run db:push
```

This will add the following fields to the `users` table:

- `provider` (text) - OAuth provider name (e.g., "google")
- `providerId` (text) - OAuth provider's user ID
- `image` (text) - User's profile image URL

## Local Development

For local development, you'll need to run the Netlify dev server:

```bash
npm run dev:server
```

This starts the Netlify functions locally at `http://localhost:8888`.

Make sure your `.env` file (for local development) includes:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8888/.netlify/functions/auth-login
JWT_SECRET=your-secret-key-here
DATABASE_URL=your-database-url
URL=http://localhost:5173
```

## How It Works

1. **User clicks "Continue with Google"** on the login page
2. **Redirects to Google OAuth** consent screen
3. **User authorizes** the application
4. **Google redirects back** with an authorization code
5. **Netlify function exchanges code** for access token
6. **Gets user info** from Google API
7. **Creates or updates user** in database
8. **Generates JWT token** and redirects to store
9. **Token stored in localStorage** as `store_auth_token`
10. **Protected routes check authentication** before rendering

## Protected Routes

The following routes require authentication:

- `/store` - Store homepage
- `/store/product/:id` - Product detail page
- `/store/checkout` - Checkout page
- `/store/checkout/success` - Checkout success page

## Public Routes

These routes are accessible without authentication:

- `/store/login` - Login page
- `/store/auth/callback` - OAuth callback handler

## User Session

User sessions are managed via JWT tokens stored in `localStorage`. Tokens expire after 7 days. The `AuthContext` automatically checks the session on app load and validates tokens with the backend.

## Logout

Users can log out via the profile dropdown menu. This removes the token from localStorage and redirects to the login page.

## Troubleshooting

### "Authentication failed" error

- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Verify the redirect URI matches exactly in Google Cloud Console
- Check Netlify function logs for detailed error messages

### "Invalid token" error

- Token may have expired (7-day expiration)
- User should log in again
- Check that `JWT_SECRET` is set correctly

### Database errors

- Ensure `DATABASE_URL` is correct
- Run `npm run db:push` to update schema
- Check that the `users` table has the new OAuth fields

### Local development issues

- Make sure `dev:server` is running on port 8888
- Verify `.env` file has all required variables
- Check that redirect URI in Google Console includes localhost
