const PLAY_SONG = 'play_song';
const ADD_TO_QUEUE = 'add_to_queue';

const noop = () => {};

class SubscriptionsApi {
  constructor() {
    this.ws = null;
    this.playSong = noop;
    this.addToQueue = noop;
  }

  subscribe(radioHash) {
    this.ws = new WebSocket('ws://localhost:8888');
    this.ws.onopen = event => {
      console.log('open event', event);
      const message = JSON.stringify({
        type: 'subscribe',
        payload: { radioHash }
      });
      this.ws.send(message);
    };
    this.ws.onmessage = event => {
      console.log(event.data);
      const { type, payload } = JSON.parse(event.data);
      console.log(type, payload);
      switch (type) {
        case PLAY_SONG:
          console.log('play song ->', payload);
          this.playSong(payload);
          break;
        case ADD_TO_QUEUE:
          console.log('add to queue ->', payload);
          this.addToQueue(payload);
          break;

        default:
          break;
      }
    };
    this.ws.onerror = event => {
      console.log('error event', event);
    };
    this.ws.onclose = event => {
      console.log('close event', event);
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
