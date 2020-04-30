const db = require('../db');

const PREMIUM = 'premium';

const userExists = (userID) => {
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then((dbConnection) => {
      dbConnection.query(
        'SELECT EXISTS ( SELECT * FROM User WHERE id = ? ) as `exists`',
        userID,
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.log(err);
            reject(new Error('Could not get user from db'));
          } else {
            resolve(results[0].exists);
          }
        }
      );
    });
  });
};

const insertUser = (user) => {
  const premium = user.product === PREMIUM;
  return new Promise((resolve, reject) => {
    const conn = db.getConnection();
    conn.then((dbConnection) => {
      dbConnection.query(
        'INSERT INTO User (id, name, email, country, premium) VALUES (?)',
        [[user.id, user.display_name, user.email, user.country, premium]],
        (err, results, fields) => {
          dbConnection.release();
          if (err) {
            console.log(err);
            reject(new Error('Could not insert user to db'));
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

module.exports = {
  userExists,
  insertUser
};
