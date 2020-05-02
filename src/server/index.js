const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const config = require('./config').server;
const controller = require('./controller');

const app = express();

app
  .use(express.static('dist'))
  .use(cors())
  .use(cookieParser())
  .use(express.json());

app.get('/login', controller.spotifyLogin);
app.get('/callback', controller.spotifyCallback);
app.get('/refresh_token', controller.spotifyTokenRefresh);

app.post('/api/radio', controller.startRadio);
app.get('/api/radio', controller.getRadio);

// Request to any other path returns the application
app.get('*', controller.serveApp);

app.listen(process.env.PORT || config.port, () =>
  console.log(`Listening on port ${process.env.PORT || config.port}!`)
);
