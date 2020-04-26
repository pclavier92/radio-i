const express = require('express');
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

app.listen(process.env.PORT || config.port, () => console.log(`Listening on port ${process.env.PORT || config.port}!`));
