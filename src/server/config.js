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
    user = 'prodDbUser';
    pass = 'prodDbPass';
    db = 'prodDbName';
    host = 'prodDbHost';
    port = 6612;
    serverPort = 8888;
    clientUrl = '';
    break;

  case 'dev':
  default:
    user = 'root';
    pass = '25031992';
    db = 'radioidb';
    host = '127.0.0.1';
    port = 3306;
    serverPort = 8888;
    clientUrl = 'http://localhost:8888';
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
