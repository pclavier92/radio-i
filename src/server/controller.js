const path = require('path');
const request = require('request');
const querystring = require('querystring');
const sha256 = require('crypto-js/sha256');

const config = require('./config').server;
const radioiService = require('./services/radioi');
const spotifyService = require('./services/spotify');
const RadioPlayer = require('./services/radio-player');
const radioSubscriptions = require('./services/radio-subscriptions');

const logger = require('./request-logger');
const {
  AuthorizationError,
  NotFoundError,
  PermissionError,
  ValidationError
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

const logOut = (req, res) => {
  logger.info(req, 'Log Out');
  // remove access token from db
  const ws = map.get(request.session.userId);
  req.session.destroy(() => {
    if (ws) ws.close();
    response.send({ result: 'OK', message: 'Session destroyed' });
  });
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
              await radioiService.userLogin(user, access_token);
              logger.info(req, 'User logged successfully');

              // updating session for user
              req.session.userId = user.id;

              // pass the token to the browser
              res.redirect(
                `${config.clientUrl}/#${querystring.stringify({
                  access_token,
                  refresh_token,
                  expires_in
                })}`
              );
            } catch (e) {
              logger.error(req, e);
            }
          }
        });
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
        logger.error(req, e);
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
      throw new AuthorizationError('No user matches the given access token');
    } else {
      throw e;
    }
  }
  return user;
};

// If not the owner throws an error
const checkIfOwner = (radioHash, userId) => {
  const userHash = sha256(nonce + userId).toString();
  if (userHash !== radioHash) {
    throw new PermissionError('Not matching ids');
  }
};

const startRadio = async (req, res) => {
  try {
    const { id: hash, name, isPublic } = req.body;
    if (!hash || !name) {
      throw new ValidationError('Request missing parameters');
    }
    const user = await getUserByAccessToken(req);
    await checkIfOwner(hash, user.id);
    const radioExists = await radioiService.radioExists(hash);
    if (!radioExists) {
      const { insertId } = await radioiService.createRadio(
        hash,
        user.id,
        name,
        isPublic
      );
      radioSubscriptions.startRadio(hash);
      new RadioPlayer(insertId, hash).collect();
      logger.info(req, 'New radio created');
      res.sendStatus(200);
    } else {
      logger.info(req, 'Radio already exists');
      res.sendStatus(400);
    }
  } catch (e) {
    logger.error(req, e);
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
    if (radio) {
      logger.info(req, 'Radio fetched');
      delete radio.userId;
      delete radio.id;
      res.status(200).send(radio);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    logger.error(req, e);
    res.sendStatus(e.status);
  }
};

const addSongToRadio = async (req, res) => {
  try {
    const { radioId: hash, songId, duration } = req.body;
    if (!hash || !songId || !duration) {
      throw new ValidationError('Request missing parameters');
    }
    const user = await getUserByAccessToken(req);
    await checkIfOwner(hash, user.id);
    const radio = await radioiService.getRadioByHash(hash);
    if (!radio) {
      throw new NotFoundError('Trying to add song to non existent radio');
    }
    if (radio.songId) {
      const position = await radioiService.getRadioLastPosition(radio.id);
      await radioiService.addSongToQueue(radio.id, songId, duration, position);
      radioSubscriptions.addSongToRadioQueue(hash, songId, position);
      logger.info(req, 'Song added to radio queue');
    } else {
      logger.info(req, 'Starting new radio and play song');
      new RadioPlayer(radio.id, radio.hash).playSong(songId, duration);
    }
    res.sendStatus(200);
  } catch (e) {
    logger.error(req, e);
    res.sendStatus(e.status || 400);
  }
};

const getRadioQueue = async (req, res) => {
  try {
    const hash = req.query.id;
    if (!hash) {
      throw new ValidationError('Radio id not specified');
    }
    await getUserByAccessToken(req); // just verify logged in user
    const radio = await radioiService.getRadioByHash(hash); // verify radio exists
    if (!radio) {
      throw new NotFoundError('The radio does not exists');
    }
    const queue = await radioiService.getRadioQueueFromHash(hash);
    logger.info(req, 'Radio queue fetched');
    res.status(200).send({ queue });
  } catch (e) {
    logger.error(req, e);
    res.sendStatus(e.status);
  }
};

module.exports = {
  logOut,
  serveApp,
  spotifyLogin,
  spotifyCallback,
  spotifyTokenRefresh,
  startRadio,
  getRadio,
  addSongToRadio,
  getRadioQueue
};
