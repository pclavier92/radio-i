const { delay } = require('../utils');
const dbService = require('./db');
const radioSubscriptions = require('./radio-subscriptions');

const ONE_SECOND = 1000;
const IDLE_TIME_BEFORE_CLOSING = 600000; // 10 minutes

class RadioPlayer {
  constructor(radioId, radioHash) {
    this.radioId = radioId;
    this.radioHash = radioHash;
  }

  async playSong(songId, duration) {
    // Start playing song on radio
    const timestamp = new Date().getTime();
    await dbService.setPlayingSong(this.radioId, songId, timestamp);
    radioSubscriptions.playSongForRadio(this.radioHash, songId, timestamp);
    // Purge radio connections
    await delay(duration - ONE_SECOND); // change one second before ending
    // Get next song from radio queue
    const nextSong = await dbService.getNextSongFromQueue(this.radioId);
    if (nextSong) {
      // Delete song from queue
      await dbService.deleteSongFromQueue(nextSong.id);
      this.playSong(nextSong.song_id, nextSong.duration);
    } else {
      // Remove Song from radio
      await dbService.setPlayingSong(this.radioId, null, null);
      this.collect();
    }
  }

  async collect() {
    await delay(IDLE_TIME_BEFORE_CLOSING);
    const radio = await dbService.getRadioById(this.radioId);
    // If radio exists but there is no song playing delete radio
    if (radio && !radio.songId) {
      radioSubscriptions.closeRadio(radio.hash);
      await dbService.deleteRadio(this.radioId);
    }
  }
}

module.exports = RadioPlayer;
