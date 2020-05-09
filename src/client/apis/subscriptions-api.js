import config from '../config';

const types = {
  SUBSCRIBE: 'subscribe',
  SUBSCRIPTION_FAILED: 'subscription_failed',
  PLAY_SONG: 'play_song',
  ADD_TO_QUEUE: 'add_to_queue'
};

const noop = () => {};

class SubscriptionsApi {
  constructor() {
    this.ws = null;
    this.playSong = noop;
    this.addToQueue = noop;
  }

  subscribe(radioHash) {
    this.ws = new WebSocket(config.wsUrl);
    this.ws.onopen = event => {
      console.log('open event', event);
      const message = JSON.stringify({
        type: types.SUBSCRIBE,
        payload: { radioHash }
      });
      this.ws.send(message);
    };
    this.ws.onmessage = event => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case types.SUBSCRIPTION_FAILED:
          // TODO -> MODAL
          this.ws.close();
          break;
        case types.PLAY_SONG:
          this.playSong(payload);
          break;
        case types.ADD_TO_QUEUE:
          this.addToQueue(payload);
          break;

        default:
          break;
      }
    };
    this.ws.onerror = event => {
      console.log('error event', event);
      // TODO -> MODAL SHOWING CONNECTION LOST
    };
    this.ws.onclose = event => {
      console.log('close event', event);
      // TODO -> MODAL SHOWING CONNECTION LOST
    };
  }

  onPlaySong(callback) {
    this.playSong = callback;
  }

  onAddToQueue(callback) {
    this.addToQueue = callback;
  }
}

export default new SubscriptionsApi();
