const session = require('express-session');

const sessionParser = session({
  saveUninitialized: false,
  secret: 'session-parser-secret',
  resave: false
});

module.exports = { sessionParser };
