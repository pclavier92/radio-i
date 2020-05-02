const path = require('path');
const request = require('request');
const querystring = require('querystring');
const sha256 = require('crypto-js/sha256');

const config = require('./config').server;
const radioiService = require('./services/radioi');
const spotifyService = require('./services/spotify');
const logger = require('./request-logger');
const {
  ValidationError,
  AuthorizationError,
  PermissionError
} = require('./errors');
const { generateRandomString } = require('./utils');

const stateKey = 'spotify_auth_state';
const nonce = 'user-hash-key';

const serveApp = (req, res) => {
  logger.info(req, 'Serve Application');
  res.sendFile(path.resolve('dist', 'index.html'));
};

const spotifyLogin = (req, res) => {
  logger.info(req, 'Login to Spotify');
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  const url = spotifyService.loginRedirectUrl(state);

  res.redirect(url);
};

const spotifyCallback = (req, res) => {
  logger.info(req, 'Spotify Login Callback');

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
              if (userExists) {
                await radioiService.updateUserToken(user.id, access_token);
                logger.info(req, 'User token updated');
              } else {
                await radioiService.insertUser(user, access_token);
                logger.info(req, 'New user created');
              }
            } catch (e) {
              logger.error(req, e.status, e.message);
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
  const {
    access_token: oldAccessToken,
    refresh_token: refreshToken
  } = req.query;
  const authOptions = spotifyService.postRefreshOptions(refreshToken);
  request.post(authOptions, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token, refresh_token, expires_in } = body;
      try {
        const { id } = await radioiService.getUserByAccessToken(oldAccessToken);
        await radioiService.updateUserToken(id, access_token);
        logger.info(req, 'User access token refreshed');
        res.send({
          access_token,
          expires_in,
          refresh_token
        });
      } catch (e) {
        logger.error(req, e.status, e.message);
      }
    }
  });
};

// Also suits the purpose of verifying that the
// requests comes from a  logged in user
const getUserByAccessToken = async req => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    throw new AuthorizationError('No access token provided');
  }
  let user;
  try {
    user = await radioiService.getUserByAccessToken(token);
  } catch (e) {
    if (e.status === 404) {
      throw new AuthorizationError('Access token not found');
    } else {
      throw e;
    }
  }
  return user;
};

const startRadio = async (req, res) => {
  try {
    const { id, name, isPublic } = req.body;
    if (!id || !name) {
      throw new ValidationError('Not matching ids');
    }
    const user = await getUserByAccessToken(req);
    const userHash = sha256(nonce + user.id).toString();
    if (userHash !== id) {
      throw new PermissionError('Not matching ids');
    }
    const radioExists = await radioiService.radioExists(id);
    if (!radioExists) {
      await radioiService.createRadio(id, user.id, name, isPublic);
      logger.info(req, 'New radio created');
    } else {
      logger.info(req, 'Radio already exists');
    }
    res.sendStatus(200);
  } catch (e) {
    logger.error(req, e.status, e.message);
    res.sendStatus(e.status || 400);
  }
};

const getRadio = async (req, res) => {
  try {
    const hash = req.query.id;
    if (!hash) {
      throw new ValidationError('Radio id not specified');
    }
    await getUserByAccessToken(req); // just verify logged in user
    const radio = await radioiService.getRadioByHash(hash);
    logger.info(req, 'Radio fetched');
    delete radio.userId;
    delete radio.id;
    res.status(200).send(radio);
  } catch (e) {
    logger.error(req, e.status, e.message);
    res.sendStatus(e.status);
  }
};

module.exports = {
  serveApp,
  spotifyLogin,
  spotifyCallback,
  spotifyTokenRefresh,
  startRadio,
  getRadio
};
