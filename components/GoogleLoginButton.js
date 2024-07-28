// components/GoogleLoginButton.js
import React from 'react';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    const CLIENT_ID = '3502125623-fje9pvbvcuet45krmcr0v1433turot75.apps.googleusercontent.com';
    const REDIRECT_URI = 'http://localhost:3000/callback'; // Changed this

    const nonce = generateRandomness(); // Use the function from @mysten/zklogin
    sessionStorage.setItem('nonce', nonce);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'id_token',
      scope: 'openid email profile',
      nonce: nonce,
    });

    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = loginURL;
  };

  return (
    <button onClick={handleLogin}>Login with Google</button>
  );
};

export default GoogleLoginButton;