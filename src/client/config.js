let serverUrl;
let wsUrl;
console.log('[SCOPE]', process.env.SCOPE);
switch (process.env.SCOPE) {
  case 'prod':
    serverUrl = '';
    wsUrl = 'wss://radioi.herokuapp.com';
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
