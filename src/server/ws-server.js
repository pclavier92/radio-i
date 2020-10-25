const WebSocket = require('ws');

const radioSubscriptions = require('./services/radio-subscriptions');
const { sessionParser } = require('./session');

const wss = new WebSocket.Server({ noServer: true });

const types = {
  SUBSCRIBE: 'subscribe',
  SUBSCRIPTION_FAILED: 'subscription_failed',
  LISTENERS_UPDATE: 'listeners_update',
  PLAY_SONG: 'play_song',
  ADD_TO_QUEUE: 'add_to_queue',
  REMOVE_FROM_QUEUE: 'remove_from_queue',
  CHAT_MESSAGE: 'chat_message'
};

const onWebsocketUpgrade = (request, socket, head) => {
  sessionParser(request, {}, () => {
    if (!request.session.user_id) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });
};

const noop = () => {};

wss.on('connection', (ws, request) => {
  ws.isAlive = true;
  ws.userId = request.session.user_id;

  const heartbeat = () => {
    ws.isAlive = true;
  };

  ws.on('pong', heartbeat);

  radioSubscriptions.addConnection(ws.userId, ws);

  ws.on('message', message => {
    const { type, payload } = JSON.parse(message);
    if (type === types.SUBSCRIBE) {
      const { radioHash } = payload;
      try {
        radioSubscriptions.subscribeUser(radioHash, ws.userId);
        console.log(
          new Date().toUTCString() +
            ` - Subscribe user ${ws.userId} to radio ${radioHash}`
        );
      } catch (e) {
        console.error(
          new Date().toUTCString() +
            `Subscription failed for user ${ws.userId} to radio ${radioHash}`
        );
        ws.send(
          JSON.stringify({
            type: types.SUBSCRIPTION_FAILED,
            payload: { message: e.message }
          })
        );
      }
    } else if (type === types.CHAT_MESSAGE) {
      radioSubscriptions.sendChatMessage(ws.userId, payload);
    }
  });

  ws.on('error', error => {
    console.error(error);
  });

  ws.on('close', code => {
    console.log(
      new Date().toUTCString() +
        ` - Connection closed for user ${ws.userId} - Closing code:${code}`
    );
    radioSubscriptions.unsubscribeUser(ws.userId);
  });
});

const interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

module.exports = { onWebsocketUpgrade };
