import React, { Component } from 'react';
import axios from 'axios';

import MediaControlCard from './components/MediaControlCard';

import { getHashParams } from './utils';
import './app.css';

export default class App extends Component {
  state = {
    access_token: null,
    refresh_token: null,
    error: null,
    song: null
  };

  componentDidMount() {
    const { access_token, refresh_token, error } = getHashParams();
    this.setState({ access_token, refresh_token, error }, () => {
      if (access_token) {
        window.location.hash = '';
        this.getUserInfo();
        this.getCurrentlyPlaying();
      }
    });
  }

  getUserInfo = () => {
    const { access_token } = this.state;
    axios
      .get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${access_token}` },
        responseType: 'json'
      })
      .then(({ data }) => console.log('/me', data))
      .catch(e => console.log(e));
  };

  getCurrentlyPlaying = () => {
    const { access_token } = this.state;
    axios
      .get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${access_token}` },
        responseType: 'json'
      })
      .then(({ data: { item } }) => this.setState({ song: item }))
      .catch(e => console.log(e));
  };

  refreshToken = () => {
    const { refresh_token } = this.state;
    if (refresh_token) {
      axios
        .get('/refresh_token', {
          params: { refresh_token }
        })
        .then(({ data: { access_token } }) => this.setState({ access_token }));
    }
  };

  render() {
    const { access_token, song, error } = this.state;
    return (
      <div>
        <div className="heading">
          {access_token ? (
            <button onClick={this.refreshToken} className="btn btn-secondary">
              Refresh access token
            </button>
          ) : (
            <a href="/login" className="btn btn-primary">
              Log in with Spotify
            </a>
          )}
          {error ? <p>Error</p> : null}
        </div>
        {song && (
          <div className="song-list">
            <MediaControlCard song={song} />
          </div>
        )}
      </div>
    );
  }
}
