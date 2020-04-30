const request = require('request');
const querystring = require('querystring');
const config = require('./config').server;

const radioiService = require('./services/radioi');
const spotifyService = require('./services/spotify');

const { generateRandomString } = require('./utils');

const stateKey = 'spotify_auth_state';

const spotifyLogin = (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  const url = spotifyService.loginRedirectUrl(state);

  res.redirect(url);
};

const spotifyCallback = (req, res) => {
  // requests refresh and access tokens after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({ error: 'state_mismatch' })}`);
  } else {
    res.clearCookie(stateKey);

    const authOptions = spotifyService.postAuthOptions(code);
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token, expires_in } = body;

        const meOptions = spotifyService.getMeOptions(access_token);
        request.get(meOptions, async (error, response, user) => {
          if (!error && response.statusCode === 200) {
            try {
              const userExists = await radioiService.userExists(user.id);
              if (!userExists) {
                radioiService.insertUser(user);
              }
            } catch (e) {
              console.log(e);
            }
          }
        });

        // pass the token to the browser
        res.redirect(
          `${config.clientUrl}/#${querystring.stringify({
            access_token,
            refresh_token,
            expires_in
          })}`
        );
      } else {
        res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
      }
    });
  }
};

const spotifyTokenRefresh = (req, res) => {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const authOptions = spotifyService.postRefreshOptions(refresh_token);
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token } = body;
      res.send({
        access_token
      });
    }
  });
};

module.exports = { spotifyLogin, spotifyCallback, spotifyTokenRefresh };
