import React from 'react';

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
    </div>
  </section>
);

export default AuthenticationRequired;
