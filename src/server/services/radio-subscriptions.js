const types = {
  SUBSCRIBE: 'subscribe',
  SUBSCRIPTION_FAILED: 'subscription_failed',
  LISTENERS_UPDATE: 'listeners_update',
  PLAY_SONG: 'play_song',
  ADD_TO_QUEUE: 'add_to_queue',
  CHAT_MESSAGE: 'chat_message'
};

class RadioSubscriptions {
  constructor() {
    this.connections = new Map(); // userId -> ws
    this.radios = new Map(); // radioHash -> [userId]
    this.subscriptions = new Map(); // userId -> radioHash
  }

  addConnection(userId, ws) {
    this.connections.set(userId, ws);
  }

  startRadio(radioHash) {
    this.radios.set(radioHash, []);
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
    console.log(`Unsubscribe user ${userId}`);
    const radioHash = this.subscriptions.get(userId);
    const radioUsers = this.radios.get(radioHash);
    if (radioUsers) {
      const newRadioUsers = radioUsers.filter(id => id !== userId);
      this.radios.set(radioHash, newRadioUsers);
    }
    const ws = this.connections.get(userId);
    if (ws) ws.close();
    this.connections.delete(userId);
    this.subscriptions.delete(userId);
    this.updateListenersForRadio(radioHash);
  }

  closeRadio(radioHash) {
    console.log('Close radio and websockets');
    const radioUsers = this.radios.get(radioHash);
    radioUsers.forEach(id => {
      const ws = this.connections.get(id);
      if (ws) ws.close();
      this.connections.delete(id);
      this.subscriptions.delete(id);
    });
    this.radios.delete(radioHash);
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
    const listeners = radioUsers.length;
    const message = { type: types.LISTENERS_UPDATE, payload: { listeners } };
    this.broadcastMessageForRadio(radioHash, message);
  }

  playSongForRadio(radioHash, songId, timestamp) {
    const message = { type: types.PLAY_SONG, payload: { songId, timestamp } };
    this.broadcastMessageForRadio(radioHash, message);
  }

  addSongToRadioQueue(radioHash, songId, position) {
    const message = { type: types.ADD_TO_QUEUE, payload: { songId, position } };
    this.broadcastMessageForRadio(radioHash, message);
  }

  sendChatMessage(userId, payload) {
    const radioHash = this.subscriptions.get(userId);
    const message = { type: types.CHAT_MESSAGE, payload };
    this.broadcastMessageForRadio(radioHash, message);
  }
}

module.exports = new RadioSubscriptions();
