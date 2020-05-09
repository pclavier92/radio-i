import React from 'react';

import PhotoBy from '../../common-components/photo-by';

import './styles.css';

const AuthenticationRequired = () => (
  <section className="section-auth-required background-img">
    <div className="row">
      <div className="auth-required-text-box">
        <h2>Authentication is required to access this content</h2>
      </div>
      <div className="login-required-text-box">
        <h1>Please login with spotify</h1>
      </div>
      <PhotoBy ph="Oscar Keys" link="https://unsplash.com/@oscartothekeys" />
    </div>
  </section>
);

export default AuthenticationRequired;
