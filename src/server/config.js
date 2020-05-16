let user;
let pass;
let db;
let host;
let port;
let serverPort;
let clientUrl;
console.log('SCOPE: ', process.env.SCOPE);
switch (process.env.SCOPE) {
  case 'prod':
    user = 'b1cd10122f9a6b';
    pass = '820aea9b';
    db = 'heroku_f1e8caaf043f227';
    host = 'us-cdbr-east-06.cleardb.net';
    port = 3306;
    serverPort = 8888;
    clientUrl = 'https://radioi.herokuapp.com';
    break;

  case 'preprod':
    user = 'root';
    pass = '25031992';
    db = 'radioidb';
    host = '127.0.0.1';
    port = 3306;
    serverPort = 8888;
    clientUrl = 'http://localhost:8888';
    break;

  case 'dev':
  default:
    user = 'root';
    pass = '25031992';
    db = 'radioidb';
    host = '127.0.0.1';
    port = 3306;
    serverPort = 8888;
    clientUrl = 'http://localhost:3000';
    break;
}

module.exports = {
  mysql: {
    host,
    user,
    password: pass,
    database: db,
    port,
    dateStrings: true,
    connectionLimit: 6,
    acquireTimeout: 60000,
    connectTimeout: 10000,
    waitForConnections: true,
    multipleStatements: true,
    queueLimit: 0
  },
  server: {
    port: serverPort,
    clientUrl
  }
};
