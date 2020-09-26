let clientUrl;
let redirect_uri;
const port = 8888;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST;
const env = process.env.SCOPE;
switch (env) {
  case 'prod':
    clientUrl = 'https://radioi.herokuapp.com';
    redirect_uri = 'https://radioi.herokuapp.com/callback/';
    break;

  case 'preprod':
    clientUrl = 'http://localhost:8888';
    redirect_uri = 'http://localhost:8888/callback/';
    break;

  case 'dev':
  default:
    clientUrl = 'http://localhost:3000';
    redirect_uri = 'http://localhost:8888/callback/';
    break;
}

module.exports = {
  mysql: {
    host,
    user,
    password,
    database,
    port: 3306,
    dateStrings: true,
    connectionLimit: 6,
    acquireTimeout: 60000,
    connectTimeout: 10000,
    waitForConnections: true,
    multipleStatements: true,
    queueLimit: 0
  },
  server: {
    env,
    port,
    clientUrl,
    client_id,
    client_secret,
    redirect_uri
  }
};
