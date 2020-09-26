const types = {
  SUBSCRIBE: 'subscribe',
  SUBSCRIPTION_FAILED: 'subscription_failed',
  LISTENERS_UPDATE: 'listeners_update',
  PLAY_SONG: 'play_song',
  ADD_TO_QUEUE: 'add_to_queue',
  REMOVE_FROM_QUEUE: 'remove_from_queue',
  CHAT_MESSAGE: 'chat_message'
};

const CLOSE_NORMAL = 1000;

class RadioSubscriptions {
  constructor() {
    this.connections = new Map(); // userId -> ws
    this.radios = new Map(); // radioHash -> [userId]
    this.subscriptions = new Map(); // userId -> radioHash
    this.chats = new Map(); // radioHash -> [chatMessage]
  }

  addConnection(userId, ws) {
    this.connections.set(userId, ws);
  }

  startRadio(radioHash) {
    this.radios.set(radioHash, []);
    this.chats.set(radioHash, []);
  }

  subscribeUser(radioHash, userId) {
    // If radioUsers for the radio is undefined the radio does not exists
    const radioUsers = this.radios.get(radioHash);
    if (radioUsers) {
      radioUsers.push(userId);
      this.radios.set(radioHash, radioUsers);
      this.subscriptions.set(userId, radioHash);
      this.updateListenersForRadio(radioHash);
    } else {
      throw new Error('Radio does not exist');
    }
  }

  unsubscribeUser(userId) {
    const radioHash = this.subscriptions.get(userId);
    const radioUsers = this.radios.get(radioHash);
    if (radioUsers) {
      const newRadioUsers = radioUsers.filter(id => id !== userId);
      this.radios.set(radioHash, newRadioUsers);
    }
    const ws = this.connections.get(userId);
    if (ws) ws.close(CLOSE_NORMAL, 'Unsubscribing user from server');
    this.connections.delete(userId);
    this.subscriptions.delete(userId);
    this.updateListenersForRadio(radioHash);
  }

  closeRadio(radioHash) {
    const radioUsers = this.radios.get(radioHash);
    radioUsers.forEach(id => {
      const ws = this.connections.get(id);
      if (ws) ws.close(CLOSE_NORMAL, 'Radio has been closed');
      this.connections.delete(id);
      this.subscriptions.delete(id);
    });
    this.radios.delete(radioHash);
    this.chats.delete(radioHash);
  }

  broadcastMessageForRadio(radioHash, msg) {
    const radioUsers = this.radios.get(radioHash);
    radioUsers.forEach(userId => {
      const ws = this.connections.get(userId);
      const { type, payload } = msg;
      if (ws) {
        ws.send(JSON.stringify({ type, payload: { ...payload } }));
      } else {
        console.log(`Websocket not found for user ${userId} in radio`);
        this.unsubscribeUser(userId);
      }
    });
  }

  updateListenersForRadio(radioHash) {
    const radioUsers = this.radios.get(radioHash);
    if (radioUsers) {
      const listeners = radioUsers.length;
      const message = { type: types.LISTENERS_UPDATE, payload: { listeners } };
      this.broadcastMessageForRadio(radioHash, message);
    }
  }

  playSongForRadio(radioHash, songId, timestamp, position) {
    const message = {
      type: types.PLAY_SONG,
      payload: { songId, timestamp, position }
    };
    this.broadcastMessageForRadio(radioHash, message);
  }

  addSongToRadioQueue(radioHash, songId, position) {
    const message = { type: types.ADD_TO_QUEUE, payload: { songId, position } };
    this.broadcastMessageForRadio(radioHash, message);
  }

  removeSongFromRadioQueue(radioHash, position) {
    const message = { type: types.REMOVE_FROM_QUEUE, payload: { position } };
    this.broadcastMessageForRadio(radioHash, message);
  }

  sendChatMessage(userId, payload) {
    const radioHash = this.subscriptions.get(userId);
    const message = { type: types.CHAT_MESSAGE, payload };
    this.addChatMessage(radioHash, payload);
    this.broadcastMessageForRadio(radioHash, message);
  }

  addChatMessage(radioHash, payload) {
    const chatMessages = this.chats.get(radioHash);
    chatMessages.push(payload);
    if (chatMessages.length > 20) {
      chatMessages.shift();
    }
    this.chats.set(chatMessages);
  }

  getChatMessages(radioHash) {
    return this.chats.get(radioHash);
  }
}

module.exports = new RadioSubscriptions();
