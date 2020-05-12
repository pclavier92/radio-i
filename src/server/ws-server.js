const WebSocket = require('ws');
const session = require('express-session');

const radioSubscriptions = require('./services/radio-subscriptions');

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

const sessionParser = session({
  saveUninitialized: false,
  secret: 'session-parser-secret',
  resave: false
});

const types = {
  SUBSCRIBE: 'subscribe',
  SUBSCRIPTION_FAILED: 'subscription_failed',
  PLAY_SONG: 'play_song',
  ADD_TO_QUEUE: 'add_to_queue',
  CHAT_MESSAGE: 'chat_message'
};

const onWebsocketUpgrade = (request, socket, head) => {
  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });
};

wss.on('connection', (ws, request) => {
  const userId = request.session.userId;

  radioSubscriptions.addConnection(userId, ws);

  ws.on('message', message => {
    const { type, payload } = JSON.parse(message);
    if (type === types.SUBSCRIBE) {
      const { radioHash } = payload;
      try {
        radioSubscriptions.subscribeUser(radioHash, userId);
        console.log(`Subscribe user ${userId} to radio ${radioHash}`);
      } catch (e) {
        console.log(
          `Subscription failed of user ${userId} to radio ${radioHash}`
        );
        ws.send(
          JSON.stringify({
            type: types.SUBSCRIPTION_FAILED,
            payload: { message: e.message }
          })
        );
      }
    } else if (type === types.CHAT_MESSAGE) {
      radioSubscriptions.sendChatMessage(userId, payload);
    }
  });

  ws.on('error', error => {
    console.log(error);
  });

  ws.on('close', () => {
    radioSubscriptions.unsubscribeUser(userId);
    console.log(`Connection closed for user ${userId}`);
  });
});

module.exports = { onWebsocketUpgrade, sessionParser };
