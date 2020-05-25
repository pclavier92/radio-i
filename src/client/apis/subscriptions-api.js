import config from '../config';

import { generateRandomString, delay } from '../utils';

const types = {
  SUBSCRIBE: 'subscribe',
  SUBSCRIPTION_FAILED: 'subscription_failed',
  LISTENERS_UPDATE: 'listeners_update',
  PLAY_SONG: 'play_song',
  ADD_TO_QUEUE: 'add_to_queue',
  REMOVE_FROM_QUEUE: 'remove_from_queue',
  CHAT_MESSAGE: 'chat_message'
};

const HALF_SECOND = 500;

const CLOSE_NORMAL = 1000;
const CLOSE_ABNORMAL = 1006;

const noop = () => {};

class SubscriptionsApi {
  constructor() {
    this.ws = null;
    this.listenersUpdate = noop;
    this.playSong = [];
    this.addToQueue = noop;
    this.removeFromQueue = noop;
    this.chatMessage = noop;
  }

  subscribe(radioHash) {
    this.ws = new WebSocket(config.wsUrl);
    this.ws.onopen = () => {
      const message = JSON.stringify({
        type: types.SUBSCRIBE,
        payload: { radioHash }
      });
      this.ws.send(message);
    };
    this.ws.onmessage = event => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case types.SUBSCRIPTION_FAILED: // do we need this
          // TODO -> MODAL
          const reason = 'Subscription failed';
          this.ws.close(CLOSE_NORMAL, reason);
          break;
        case types.LISTENERS_UPDATE:
          this.listenersUpdate(payload);
          break;
        case types.PLAY_SONG:
          this.playSong.forEach(cb => cb(payload));
          break;
        case types.ADD_TO_QUEUE:
          this.addToQueue(payload);
          break;
        case types.REMOVE_FROM_QUEUE:
          this.removeFromQueue(payload);
          break;
        case types.CHAT_MESSAGE:
          this.chatMessage(payload);
          break;
        default:
          break;
      }
    };
    this.ws.onerror = event => {
      console.error('error event', event);
      // TODO -> MODAL SHOWING CONNECTION LOST
    };
    this.ws.onclose = async event => {
      if (event.code === CLOSE_ABNORMAL) {
        await delay(HALF_SECOND);
        this.subscribe(radioHash);
      } else {
        console.log('close event', event);
      }
      // TODO -> MODAL SHOWING CONNECTION LOST
    };
  }

  onListenersUpdate(callback) {
    this.listenersUpdate = callback;
  }

  addPlaySongListener(callback) {
    this.playSong.push(callback);
  }

  removePlaySongListener(callback) {
    this.playSong = this.playSong.filter(cb => cb !== callback);
  }

  onAddToQueue(callback) {
    this.addToQueue = callback;
  }

  onRemoveFromQueue(callback) {
    this.removeFromQueue = callback;
  }

  onChatMessage(callback) {
    this.chatMessage = callback;
  }

  sendChatMessage(user, message) {
    const id = generateRandomString(10);
    const msg = JSON.stringify({
      type: types.CHAT_MESSAGE,
      payload: { id, user, message }
    });
    this.ws.send(msg);
  }

  unsubscribe(reason) {
    if (this.ws) {
      this.ws.close(CLOSE_NORMAL, reason);
    }
  }
}

export default new SubscriptionsApi();
