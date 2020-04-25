let serverUrl;
console.log('SCOPE: ', process.env.SCOPE);
switch (process.env.SCOPE) {
  case 'prod':
    serverUrl = '';
    break;

  case 'dev':
  default:
    serverUrl = 'http://localhost:8888';
    break;
}

module.exports = {
  serverUrl
};
