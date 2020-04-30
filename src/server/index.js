const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const config = require('./config').server;
const controller = require('./controller');

const app = express();

app
  .use(express.static('dist'))
  .use(cors())
  .use(cookieParser());

app.get('/login', controller.spotifyLogin);
app.get('/callback', controller.spotifyCallback);
app.get('/refresh_token', controller.spotifyTokenRefresh);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  console.log('[GET]', req.originalUrl);
  res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(process.env.PORT || config.port, () =>
  console.log(`Listening on port ${process.env.PORT || config.port}!`)
);
