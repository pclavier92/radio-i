let serverUrl;
let wsUrl;
switch (process.env.SCOPE) {
  case 'prod':
    serverUrl = '';
    wsUrl = 'wss://radioi.herokuapp.com';
    break;

  case 'preprod':
    serverUrl = '';
    wsUrl = 'ws://localhost:8888';
    break;

  case 'dev':
  default:
    serverUrl = 'http://localhost:8888';
    wsUrl = 'ws://localhost:8888';
    break;
}

module.exports = {
  serverUrl,
  wsUrl
};
