const mysql = require("mysql");
const config = require("./config").mysql;

console.log("Creating pool");
const pool = mysql.createPool(config);
console.log("pool");

module.exports = {
  closePool: cb => {
    pool.end(cb);
  },
  configuration: config,
  getConnection: () => {
    return new Promise((resolve, reject) => {
      try {
        pool.getConnection((err, conn) => {
          if (err) {
            console.log("MySQL — Error connecting: " + err.stack);
            reject(err);
          } else {
            resolve(conn);
          }
        });
      } catch (e) {
        console.log("MySQL — Error connecting" + e);
        reject(e);
      }
    });
  }
};

// connection.end();
