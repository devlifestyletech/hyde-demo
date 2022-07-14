import React from 'react';
import { Link } from 'react-router-dom';

function ConfirmRegistrationPage() {
  return (
    <div style={{ marginTop: 50, color: 'white' }}>
      <h1 style={{ color: 'white' }}>Congratulations!</h1>
      <h3 style={{ color: 'white' }}>Welcome to Hyde heritage!</h3>
      <p>
        If you're juristic click this <Link to="signin"> link </Link> to signin
      </p>
      <p>
        If you're customers please sign in to use ours service on mobile
        application
      </p>
    </div>
  );
}

export default ConfirmRegistrationPage;
