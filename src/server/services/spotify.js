const querystring = require('querystring');

const { client_id, client_secret, redirect_uri } = require('../../../app-keys');

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-top-read'
];

const scope = scopes.join(' ');

const loginRedirectUrl = state => 'https://accounts.spotify.com/authorize?'
  + querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state
  });

const postAuthOptions = code => ({
  url: 'https://accounts.spotify.com/api/token',
  form: {
    code,
    redirect_uri,
    grant_type: 'authorization_code'
  },
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${client_id}:${client_secret}`
    ).toString('base64')}`
  },
  json: true
});

const postRefreshOptions = refreshToken => ({
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${client_id}:${client_secret}`
    ).toString('base64')}`
  },
  form: {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  },
  json: true
});

const getMeOptions = accessToken => ({
  url: 'https://api.spotify.com/v1/me',
  headers: { Authorization: `Bearer ${accessToken}` },
  json: true
});

module.exports = {
  loginRedirectUrl,
  postAuthOptions,
  postRefreshOptions,
  getMeOptions
};
