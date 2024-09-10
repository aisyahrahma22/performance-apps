require('newrelic');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const next = require('next');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextEnv = require('@next/env');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

nextEnv.loadEnvConfig('./');

const port = parseInt(process.env.PORT, 10);

const env = process.env.NODE_ENV || 'development';
const dev = env !== 'production';
const app = next({
  dir: '.',
  dev,
});

const handle = app.getRequestHandler();
let server;
app
  .prepare()
  .then(() => {
    server = express();

    // BACKEND APIs
    const backendProxy = {
      '/api': {
        target: process.env.BACKEND_HOST,
        pathRewrite: { '^/api': '/' },
        secure: false,
        httpOnly: true,
        changeOrigin: true,
      },
      // '/socket.io': {
      //   target: process.env.NEXT_PUBLIC_SOCKET_HOST,
      //   pathRewrite: { '^/socket.io': '/' },
      //   ws: true,
      //   secure: false,
      //   changeOrigin: true,
      // },
    };

    Object.keys(backendProxy).forEach(function (context) {
      server.use(context, createProxyMiddleware(backendProxy[context]));
    });
    server.use(createProxyMiddleware('/socket.io', { target: process.env.NEXT_PUBLIC_SOCKET_HOST, ws: true}))

    server.all('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      // eslint-disable-next-line no-console
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('An error occurred, unable to start the server');
    // eslint-disable-next-line no-console
    console.log(err);
  });
