const express = require('express');
const os = require('os');

const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const config = require('./config').server;
const { generateRandomString } = require('./utils');
const { client_id, client_secret, redirect_uri } = require('../../app-keys');

const stateKey = 'spotify_auth_state';

const app = express();

app
  .use(express.static('dist'))
  .use(cors())
  .use(cookieParser());

app.get('/api/getUsername', (req, res) => {
  res.send({ username: os.userInfo().username });
});

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-top-read'
  ];
  const scope = scopes.join(' ');

  res.redirect(
    'https://accounts.spotify.com/authorize?'
      + querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state
      })
  );
});

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      '/#'
        + querystring.stringify({
          error: 'state_mismatch'
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic '
          + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token, expires_in } = body;

        // const options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { Authorization: 'Bearer ' + access_token },
        //   json: true
        // };

        // // use the access token to access the Spotify Web API
        // request.get(options, (error, response, body) => {
        //   console.log(body);
        // });

        // we can also pass the token to the browser to make requests from there

        res.redirect(
          `${config.clientUrl}/#${querystring.stringify({
            access_token,
            refresh_token,
            expires_in
          })}`
        );
      } else {
        res.redirect(
          '/#'
            + querystring.stringify({
              error: 'invalid_token'
            })
        );
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic '
        + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token } = body;
      res.send({
        access_token
      });
    }
  });
});

app.listen(process.env.PORT || config.port, () => console.log(`Listening on port ${process.env.PORT || config.port}!`));
