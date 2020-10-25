const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

const config = require('./config').server;
const { sessionParser } = require('./session');
const controller = require('./controller');
const { onWebsocketUpgrade } = require('./ws-server');

const app = express();

app
  .use(express.static('dist'))
  .use(cors())
  .use(cookieParser())
  .use(express.json())
  .use(sessionParser);

app.get('/login', controller.spotifyLogin);
app.get('/callback', controller.spotifyCallback);
app.get('/refresh_token', controller.spotifyTokenRefresh);
app.delete('/logout', controller.logOut);

app.get('/api/radio', controller.getRadio);
app.get('/api/radio/latest', controller.getLatestRadios);
app.get('/api/radio/queue', controller.getRadioQueue);
app.get('/api/radio/played', controller.getRadioPlayedSongs);
app.get('/api/radio/chats', controller.getChatMessages);
app.post('/api/radio', controller.startRadio);
app.post('/api/radio/song', controller.addSongToRadio);
app.delete('/api/radio', controller.stopRadio);
app.delete('/api/radio/song', controller.removeSongFromRadio);

// Request to any other path returns the application
app.get('*', controller.serveApp);

// Create HTTP server to handle websocket upgrade
const server = http.createServer(app);
server.on('upgrade', onWebsocketUpgrade);

server.listen(process.env.PORT || config.port, () => {
  console.log(`Listening on port ${process.env.PORT || config.port}!`);
});
