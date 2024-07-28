import { useState, useEffect } from 'react';

export default function Home() {
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem('zkLoginUserAddress');
    if (storedAddress) {
      setZkLoginUserAddress(storedAddress);
    }
  }, []);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.slice(1));
      const idToken = params.get('id_token');
      if (idToken) {
        handleAuthResponse(idToken);
      }
    }
  }, []);

  const startOAuthFlow = async () => {
    const CLIENT_ID = '3502125623-fje9pvbvcuet45krmcr0v1433turot75.apps.googleusercontent.com';
    const REDIRECT_URL = 'http://localhost:3000/callback';
    const nonce = Math.random().toString(36).substring(2, 15);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid email&nonce=${nonce}`;
    setAuthUrl(authUrl);
    window.location.href = authUrl;
  };

  const handleAuthResponse = async (idToken) => {
    try {
      const response = await fetch(`/api/auth/callback?id_token=${idToken}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setZkLoginUserAddress(data.address);
    } catch (error) {
      console.error('Error handling auth response:', error);
    }
  };

  return (
    <div>
      <h1>zkLogin with Sui</h1>
      {!zkLoginUserAddress && (
        <button onClick={startOAuthFlow} style={{ padding: '10px 20px', fontSize: '16px', margin: '20px' }}>
          Login with Google
        </button>
      )}
      {zkLoginUserAddress && (
        <div>
          <p>Your zkLogin Sui Address: {zkLoginUserAddress}</p>
        </div>
      )}
    </div>
  );
}