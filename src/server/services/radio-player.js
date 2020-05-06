const radioiService = require('./radioi');
const radioSubscriptions = require('./radio-subscriptions');

const delay = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

class RadioPlayer {
  constructor(radioId, radioHash) {
    this.radioId = radioId;
    this.radioHash = radioHash;
  }

  async playSong(songId, duration) {
    // Start playing song on radio
    console.log('Start playing song on radio');
    const timestamp = new Date().getTime();
    await radioiService.setPlayingSong(this.radioId, songId, timestamp);
    radioSubscriptions.playSongForRadio(this.radioHash, songId, timestamp);
    await delay(duration - 1000); // change one second before ending
    // Get next song from radio queue
    console.log('Get next song from radio queue');
    const nextSong = await radioiService.getNextSongFromQueue(this.radioId);
    if (nextSong) {
      // Delete song from queue
      console.log('Delete song from queue');
      await radioiService.deleteSongFromQueue(nextSong.id);
      console.log(`Play next song - ${new Date().toUTCString()}`);
      this.playSong(nextSong.song_id, nextSong.duration);
    } else {
      // Remove Song from radio
      await radioiService.setPlayingSong(this.radioId, null, null);
      this.collect();
    }
  }

  async collect() {
    const date = new Date();
    console.log(`Start radio collector - ${new Date().toUTCString()}`);
    await delay(600000); // 10 min
    const radio = await radioiService.getRadioById(this.radioId);
    // If radio exists but there is no song playing delete radio
    if (radio && !radio.songId) {
      console.log(`Delete radio - ${new Date().toUTCString()}`);
      radioSubscriptions.removeRadio(radio.hash);
      await radioiService.deleteRadio(this.radioId);
    }
  }
}

module.exports = RadioPlayer;
