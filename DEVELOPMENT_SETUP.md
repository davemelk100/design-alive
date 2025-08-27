# Development Setup for RSS Feed Creator

## Overview

This project includes a custom RSS feed creator that works both in development and production environments.

## Development Mode

During development, the RSS feed creator uses a local development server to handle requests.

### Starting the Development Server

```bash
npm run dev:server
```

This starts a local server on port 8888 that handles RSS feed creation requests.

### Development Server Features

- **Health Check**: `GET http://localhost:8888/`
- **RSS Creation**: `POST http://localhost:8888/create-rss-feed`
- **CORS Enabled**: Works with your local Vite dev server
- **Simple Parsing**: Basic HTML parsing for development purposes

## Production Mode

In production, the RSS feed creator uses Netlify Functions deployed at `/.netlify/functions/create-rss-feed`.

## Vite Proxy Configuration

The Vite configuration includes a proxy that routes `/.netlify/functions/*` requests to the development server during development:

```typescript
// vite.config.ts
server: {
  proxy: {
    "/.netlify/functions": {
      target: "http://localhost:8888",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ""),
    },
  },
},
```

## Testing the RSS Feed Creator

1. Start the development server: `npm run dev:server`
2. Start the Vite dev server: `npm run dev`
3. Navigate to the news page and try creating a custom RSS feed
4. The request will be proxied to the local development server

## Troubleshooting

- **Port 8888 already in use**: Kill any existing processes or change the port in `scripts/dev-server.js`
- **CORS issues**: Ensure the development server is running before starting Vite
- **Function not found**: Check that the development server is running and accessible at `http://localhost:8888`

## File Structure

```
scripts/
  dev-server.js          # Development server for RSS feed creation
netlify/functions/
  create-rss-feed.ts     # Production Netlify function
vite.config.ts           # Vite configuration with proxy
```
