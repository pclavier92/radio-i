const PLAY_SONG = 'play_song';
const ADD_TO_QUEUE = 'add_to_queue';

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
    const radio = this.subscriptions.get(userId);
    if (!radio) {
      const radioUsers = this.radios.get(radioHash);
      radioUsers.push(userId);
      this.radios.set(radioHash, radioUsers);
      this.subscriptions.set(userId, radioHash);
    } else if (radio !== radioHash) {
      // See if user is trying to subscribe to other radio
      // and handle that case
    }
  }

  unsubscribeUser(userId) {
    const radioHash = this.subscriptions.get(userId);
    const radioUsers = this.radios.get(radioHash);
    const newRadioUsers = radioUsers.filter(id => id !== userId);
    this.radios.set(radioHash, newRadioUsers);
    const ws = this.connections.get(userId);
    if (ws) ws.close();
    this.connections.delete(userId);
    this.subscriptions.delete(userId);
  }

  closeRadio(radioHash) {
    const radioUsers = this.radios.get(radioHash);
    radioUsers.forEach(id => {
      const ws = this.connections.get(id);
      if (ws) ws.close();
      this.connections.delete(id);
    });
    this.radios.delete(radioHash);
    this.subscriptions.delete(id);
  }

  broadcastMessageForRadio(radioHash, msg) {
    const radioUsers = this.radios.get(radioHash);
    const subscriptions = radioUsers.length;
    radioUsers.forEach(userId => {
      const ws = this.connections.get(userId);
      const { type, payload } = msg;
      if (ws) {
        ws.send(
          JSON.stringify({ type, payload: { subscriptions, ...payload } })
        );
      } else {
        // TODO
        console.log('Websocket not found for user in radio');
      }
    });
  }

  playSongForRadio(radioHash, songId, timestamp) {
    const message = { type: PLAY_SONG, payload: { songId, timestamp } };
    this.broadcastMessageForRadio(radioHash, message);
  }

  addSongToRadioQueue(radioHash, songId, position) {
    const message = { type: ADD_TO_QUEUE, payload: { songId, position } };
    this.broadcastMessageForRadio(radioHash, message);
  }
}

module.exports = new RadioSubscriptions();
