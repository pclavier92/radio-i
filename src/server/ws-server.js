const WebSocket = require('ws');
const session = require('express-session');

const radioSubscriptions = require('./services/radio-subscriptions');

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

const sessionParser = session({
  saveUninitialized: false,
  secret: 'session-parser-secret',
  resave: false
});

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
    const data = JSON.parse(message);
    const { type, payload } = data;

    if (type === 'subscribe') {
      const { radioId } = payload;
      radioSubscriptions.addSubscriptor(radioId, userId);
      console.log('Subscribe to readio');
    }

    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from ${userId}`);
  });

  ws.on('close', () => {
    radioSubscriptions.removeSubscription(userId);
  });
});

module.exports = { onWebsocketUpgrade, sessionParser };
