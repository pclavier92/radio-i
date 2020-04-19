import React, { Component } from 'react';
import axios from 'axios';

import NowPlaying from './components/NowPlaying';

import { getHashParams } from './utils';
import './app.css';

// PROVISIONAL
const LOCAL_SERVER_URL = 'http://localhost:8888';

export default class App extends Component {
  timer = null;

  state = {
    access_token: null,
    refresh_token: null,
    error: null
  };

  componentDidMount() {
    const { access_token, refresh_token, error } = getHashParams();
    this.setState({ access_token, refresh_token, error }, () => {
      if (access_token) {
        window.location.hash = '';
        this.getUserInfo();
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

  refreshToken = () => {
    const { refresh_token } = this.state;
    if (refresh_token) {
      axios
        .get(`${LOCAL_SERVER_URL}/refresh_token`, {
          params: { refresh_token }
        })
        .then(({ data: { access_token } }) => this.setState({ access_token }));
    }
  };

  render() {
    const { access_token, error } = this.state;

    return (
      <div>
        <div className="heading">
          {access_token ? (
            <button onClick={this.refreshToken} className="btn btn-secondary">
              Refresh access token
            </button>
          ) : (
            <a href={`${LOCAL_SERVER_URL}/login`} className="btn btn-primary">
              Log in with Spotify
            </a>
          )}
          {error ? <p>Error</p> : null}
        </div>
        <div className="song-list">
          {access_token && <NowPlaying token={access_token} />}
        </div>
      </div>
    );
  }
}
