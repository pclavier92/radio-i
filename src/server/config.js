let user;
let pass;
let db;
let host;
let port;
let serverPort;
let clientUrl;
let client_id;
let client_secret;
let redirect_uri;
switch (process.env.SCOPE) {
  case 'prod':
    user = 'b1cd10122f9a6b';
    pass = '820aea9b';
    db = 'heroku_f1e8caaf043f227';
    host = 'us-cdbr-east-06.cleardb.net';
    port = 3306;
    serverPort = 8888;
    clientUrl = 'https://radioi.herokuapp.com';
    client_id = '284faef9d7c24d14b2e14930c27caba1';
    client_secret = '196d33bc88c3492583e9be8831d85a25';
    redirect_uri = 'https://radioi.herokuapp.com/callback/';
    break;

  case 'preprod':
    user = 'root';
    pass = '25031992';
    db = 'radioidb';
    host = '127.0.0.1';
    port = 3306;
    serverPort = 8888;
    clientUrl = 'http://localhost:8888';
    client_id = '284faef9d7c24d14b2e14930c27caba1';
    client_secret = '196d33bc88c3492583e9be8831d85a25';
    redirect_uri = 'http://localhost:8888/callback/';
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
    client_id = '284faef9d7c24d14b2e14930c27caba1';
    client_secret = '196d33bc88c3492583e9be8831d85a25';
    redirect_uri = 'http://localhost:8888/callback/';
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
    clientUrl,
    client_id,
    client_secret,
    redirect_uri
  }
};
