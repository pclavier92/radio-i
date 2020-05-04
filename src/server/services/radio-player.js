const radioiService = require('./radioi');

const delay = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

class RadioPlayer {
  constructor(radioId) {
    this.radioId = radioId;
  }

  async playSong(songId, duration) {
    // Start playing song on radio
    console.log('Start playing song on radio');
    await radioiService.startPlayingSong(this.radioId, songId);
    await delay(duration);
    // Get next song from radio queue
    console.log('Get next song from radio queue');
    const nextSong = await radioiService.getNextSongFromQueue(this.radioId);
    if (nextSong) {
      // Delete song from queue
      console.log('Delete song from queue');
      await radioiService.deleteSongFromQueue(nextSong.id);
      console.log('Play next song');
      this.playSong(nextSong.song_id, nextSong.duration);
    } else {
      console.log('Delete radio');
      await radioiService.deleteRadio(this.radioId);
    }
  }
}

module.exports = RadioPlayer;
