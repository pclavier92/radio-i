const db = require('../db');

const { NotFoundError, DatabaseError } = require('../errors');

const PREMIUM = 'premium';

const getUserByAccessToken = accessToken =>
  new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'SELECT * FROM User WHERE access_token = ?',
        accessToken,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(
              new DatabaseError('Could not get user by access token from db')
            );
          } else if (!results[0]) {
            console.error(err);
            reject(
              new NotFoundError('No user found with the provided access token')
            );
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  });

const userExists = userID =>
  new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'SELECT EXISTS ( SELECT * FROM User WHERE id = ? ) as `exists`',
        userID,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get user from db'));
          } else {
            resolve(results[0].exists);
          }
        }
      );
    });
  });

const insertUser = (user, accessToken) => {
  const premium = user.product === PREMIUM;
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'INSERT INTO User (id, name, email, country, premium, access_token) VALUES (?)',
        [
          [
            user.id,
            user.display_name,
            user.email,
            user.country,
            premium,
            accessToken
          ]
        ],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not insert user to db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const updateUserToken = (userId, accessToken) =>
  new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'UPDATE User SET access_token= ? WHERE id = ?',
        [accessToken, userId],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(
              new DatabaseError('Could not update users access token in db')
            );
          } else {
            resolve(results);
          }
        }
      );
    });
  });

const userLogin = async (user, accessToken) => {
  const exists = await userExists(user.id);
  if (exists) {
    await updateUserToken(user.id, accessToken);
  } else {
    await insertUser(user, accessToken);
  }
};

const radioExists = hash =>
  new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'SELECT EXISTS ( SELECT * FROM Radio WHERE hash = ? ) as `exists`',
        hash,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get radio from db'));
          } else {
            resolve(results[0].exists);
          }
        }
      );
    });
  });

const createRadio = (
  hash,
  userId,
  name,
  isPublic,
  isCollaborative,
  isAnonymous
) => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'INSERT INTO Radio (hash, user_id, name, is_public, is_collaborative, is_anonymous) VALUES (?)',
        [[hash, userId, name, isPublic, isCollaborative, isAnonymous]],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not insert radio to db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const getLatestRadios = () =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT hash, name as radioName, is_collaborative as isCollaborative, is_anonymous as isAnonymous FROM Radio WHERE is_public = 1 ORDER BY id DESC LIMIT 10',
        null,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get last radios'));
          } else if (!results[0]) {
            resolve([]);
          } else {
            resolve(results);
          }
        }
      );
    });
  });

const getRadioByHash = hash =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT Radio.*, User.name as user_name FROM Radio INNER JOIN User ON Radio.user_id = User.id WHERE Radio.hash = ?',
        hash,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get radio'));
          } else if (!results[0]) {
            resolve(null);
          } else {
            resolve({
              id: results[0].id,
              hash: results[0].hash,
              userId: results[0].user_id,
              userName: results[0].user_name,
              name: results[0].name,
              isPublic: results[0].is_public ? true : false,
              isCollaborative: results[0].is_collaborative ? true : false,
              isAnonymous: results[0].is_anonymous ? true : false,
              songId: results[0].song_id,
              timestamp: results[0].timestamp_ms
            });
          }
        }
      );
    });
  });

const getRadioById = id =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT * FROM Radio WHERE id = ?',
        id,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get radio'));
          } else if (!results[0]) {
            resolve(null);
          } else {
            resolve({
              id: results[0].id,
              hash: results[0].hash,
              userId: results[0].user_id,
              name: results[0].name,
              isPublic: results[0].is_public ? true : false,
              isCollaborative: results[0].is_collaborative ? true : false,
              isAnonymous: results[0].is_anonymous ? true : false,
              songId: results[0].song_id,
              timestamp: results[0].timestamp_ms
            });
          }
        }
      );
    });
  });

const getRadioByUserId = userId =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT * FROM Radio WHERE user_id = ?',
        userId,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get radio'));
          } else if (!results[0]) {
            resolve(null);
          } else {
            resolve({
              id: results[0].id,
              hash: results[0].hash,
              userId: results[0].user_id,
              name: results[0].name,
              isPublic: results[0].is_public ? true : false,
              isCollaborative: results[0].is_collaborative ? true : false,
              isAnonymous: results[0].is_anonymous ? true : false,
              songId: results[0].song_id,
              timestamp: results[0].timestamp_ms
            });
          }
        }
      );
    });
  });

const setPlayingSong = (radioId, songId, timestamp) =>
  new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'UPDATE Radio SET song_id= ?, timestamp_ms = ? WHERE id = ?',
        [songId, timestamp, radioId],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(
              new DatabaseError('Could not update song playing in radio in db')
            );
          } else {
            resolve(results);
          }
        }
      );
    });
  });

const getRadioLastPosition = radioId =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT position FROM `RadioQueue` WHERE radio_id = ? ORDER BY position DESC LIMIT 1',
        radioId,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(
              new DatabaseError('Could not get last position from radio queue')
            );
          } else if (!results[0]) {
            resolve(1); // This has been saving my ass without my knowledge
          } else {
            resolve(results[0].position + 1);
          }
        }
      );
    });
  });

const addSongToQueue = (radioID, songId, duration, position, played) => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'INSERT INTO RadioQueue (radio_id, song_id, duration, position, played) VALUES (?)',
        [[radioID, songId, duration, position, played]],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not insert song to radio in db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const updateQueueSongToPlayed = id => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'UPDATE RadioQueue SET played = 1 WHERE id = ?',
        id,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not insert song to radio in db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const deleteSongFromRadioQueue = (radioID, position) => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'DELETE FROM RadioQueue WHERE radio_id = ? AND position = ?',
        [radioID, position],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not insert song to radio in db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const getRadioQueueFromHash = hash =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT rq.song_id as songId, rq.duration as duration, ' +
          'rq.position as position FROM Radio as r ' +
          'INNER JOIN RadioQueue as rq ON rq.radio_id = r.id WHERE r.hash = ? AND rq.played = 0',
        hash,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get radio'));
          } else if (!results[0]) {
            resolve([]);
          } else {
            resolve(results);
          }
        }
      );
    });
  });

const getRadioPlayedSongs = hash =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT rq.song_id as songId, rq.duration as duration, ' +
          'rq.position as position FROM Radio as r ' +
          'INNER JOIN RadioQueue as rq ON rq.radio_id = r.id WHERE r.hash = ? AND rq.played = 1',
        hash,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not get radio'));
          } else if (!results[0]) {
            resolve([]);
          } else {
            resolve(results);
          }
        }
      );
    });
  });

const getNextSongFromQueue = radioId =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT * FROM `RadioQueue` WHERE radio_id = ? AND played = 0 ORDER BY position ASC LIMIT 1',
        radioId,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.error(err);
            reject(
              new DatabaseError('Could not get next song from radio queue')
            );
          } else if (!results[0]) {
            resolve(null);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  });

// Deprecated
const deleteSongFromQueue = id => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'DELETE FROM RadioQueue WHERE id = ?',
        id,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not delete song from radio in db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const deleteRadio = id => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'DELETE FROM Radio WHERE id = ?',
        id,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not delete radio in db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const deleteRadioQueue = radioId => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'DELETE FROM RadioQueue WHERE radio_id = ?',
        radioId,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.error(err);
            reject(new DatabaseError('Could not delete radio in db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

module.exports = {
  getUserByAccessToken,
  userExists,
  insertUser,
  updateUserToken,
  userLogin,
  radioExists,
  createRadio,
  getLatestRadios,
  getRadioByHash,
  getRadioById,
  getRadioByUserId,
  setPlayingSong,
  getRadioLastPosition,
  addSongToQueue,
  updateQueueSongToPlayed,
  getRadioQueueFromHash,
  getRadioPlayedSongs,
  getNextSongFromQueue,
  deleteSongFromQueue,
  deleteRadio,
  deleteRadioQueue,
  deleteSongFromRadioQueue
};
