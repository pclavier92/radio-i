const db = require('../db');

const { NotFoundError, DatabaseError } = require('../errors');

const PREMIUM = 'premium';

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
            console.log(err);
            reject(new DatabaseError('Could not get user from db'));
          } else {
            resolve(results[0].exists);
          }
        }
      );
    });
  });

const insertUser = user => {
  const premium = user.product === PREMIUM;
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'INSERT INTO User (id, name, email, country, premium) VALUES (?)',
        [[user.id, user.display_name, user.email, user.country, premium]],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.log(err);
            reject(new DatabaseError('Could not insert user to db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
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
            console.log(err);
            reject(new DatabaseError('Could not get radio from db'));
          } else {
            resolve(results[0].exists);
          }
        }
      );
    });
  });

const createRadio = (hash, userId, name, isPublic) => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then(dbConnection => {
      dbConnection.query(
        'INSERT INTO Radio (hash, user_id, name, is_public) VALUES (?)',
        [[hash, userId, name, isPublic]],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.log(err);
            reject(new DatabaseError('Could not insert radio to db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

const getRadioByHash = hash =>
  new Promise((resolve, reject) => {
    let conn = db.getConnection();
    conn.then(db => {
      db.query(
        'SELECT Radio.*, User.name as user_name FROM Radio INNER JOIN User WHERE Radio.user_id = User.id AND Radio.hash = ?',
        hash,
        (err, results, fields) => {
          db.release();
          if (err) {
            console.log(err);
            reject(new DatabaseError('Could not get radio'));
          } else if (!results[0]) {
            console.log(err);
            reject(
              new NotFoundError('No radio found corresponding to the hash')
            );
          } else {
            resolve({
              id: results[0].id,
              hash: results[0].hash,
              userId: results[0].user_id,
              userName: results[0].user_name,
              name: results[0].name,
              isPublic: results[0].is_public ? true : false,
              songId: results[0].song_id,
              timestamp: results[0].timestamp_ms
            });
          }
        }
      );
    });
  });

module.exports = {
  userExists,
  insertUser,
  radioExists,
  createRadio,
  getRadioByHash
};
