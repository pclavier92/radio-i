class RadioSubscriptions {
  constructor() {
    this.connections = new Map();
    this.radios = new Map();
  }

  addConnection(userId, ws) {
    this.connections.set(userId, ws);
  }

  addRadio(radioHash) {
    this.radios.set(radioHash, []);
  }

  addSubscriptor(radioHash, userId) {
    const radioUsers = this.radios.get(radioHash);
    radioUsers.push(userId);
    this.radios.set(radioHash, radioUsers);
  }

  removeSubscription(userId) {
    // const radioUsers = this.radios.get(radioHash);
    // const newRadioUsers = radioUsers.filter(id => id === userId);
    // this.radios.set(newRadioUsers);
    const ws = this.connections.get(userId);
    if (ws) ws.close();
    this.connections.delete(userId);
  }

  removeRadio(radioHash) {
    const radioUsers = this.radios.get(radioHash);
    radioUsers.forEach(id => {
      const ws = this.connections.get(id);
      if (ws) ws.close();
      this.connections.delete(id);
    });
    this.radios.delete(radioHash);
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
      }
    });
  }

  playSongForRadio(radioHash, songId, timestamp) {
    const message = { type: 'play_song', payload: { songId, timestamp } };
    this.broadcastMessageForRadio(radioHash, message);
  }
}

module.exports = new RadioSubscriptions();
