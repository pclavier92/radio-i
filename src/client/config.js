let serverUrl;
let wsUrl;
console.log('[SCOPE]', process.env.SCOPE);
switch (process.env.SCOPE) {
  case 'prod':
    serverUrl = '';
    wsUrl = 'ws://radioi.herokuapp.com';
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
