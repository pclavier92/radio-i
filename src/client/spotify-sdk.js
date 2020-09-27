import spotifyWebApi from 'Apis/spotify-web-api';
import authService from 'Services/authentication';

class SpotifySDK {
  constructor() {
    this.player = null;
  }

  start(onReady) {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: 'RadioI',
        getOAuthToken: cb => {
          const token = authService.getAccessToken();
          cb(token);
        },
        volume: 0.001
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });
      this.player.addListener('authentication_error', async ({ message }) => {
        try {
          await authService.refreshAuthentication();
        } catch (e) {
          console.log(message);
          console.log(e);
        }
      });
      this.player.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      this.player.addListener('playback_error', ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      // this.player.addListener('player_state_changed', state => {
      //   console.log(state);
      // });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready with Device ID', device_id);
        spotifyWebApi.setDeviceId(device_id);
        onReady();
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      this.player.connect();
    };
  }

  disconnect() {
    // Disconnect from the player
    this.player.disconnect();
    // Remove listeners
    this.player.removeListener('initialization_error');
    this.player.removeListener('authentication_error');
    this.player.removeListener('account_error');
    this.player.removeListener('playback_error');
    this.player.removeListener('ready');
    this.player.removeListener('not_ready');
  }
}

export default new SpotifySDK();
