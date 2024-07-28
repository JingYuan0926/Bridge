import { useState, useEffect } from 'react';

export default function FloatingLoginButton() {
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const storedAddress = localStorage.getItem('zkLoginUserAddress');
    if (storedAddress) {
      setZkLoginUserAddress(storedAddress);
      fetchBalance(storedAddress);
    }
  }, []);

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

  const fetchBalance = async (address) => {
    try {
      const response = await fetch('https://fullnode.testnet.sui.io/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getBalance',
          params: [address, '0x2::sui::SUI']
        }),
      });

      const data = await response.json();
      if (data.result && data.result.totalBalance) {
        const balanceInSui = parseInt(data.result.totalBalance) / 1000000000;
        setBalance(balanceInSui.toFixed(9));
      } else {
        setBalance('0');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error fetching balance');
    }
  };

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
      localStorage.setItem('zkLoginUserAddress', data.address);
      fetchBalance(data.address);
    } catch (error) {
      console.error('Error handling auth response:', error);
    }
  };

  return (
    <div>
      {!zkLoginUserAddress && (
        <button onClick={startOAuthFlow} className="play-button">
          GET STARTED
        </button>
      )}
      {zkLoginUserAddress && (
        <div className="float-button">
          <p>Your Sui Address: {zkLoginUserAddress}</p>
          {balance !== null && (
            <p>Balance: {balance} SUI</p>
          )}
        </div>
      )}
      <style jsx>{`
.float-button{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgb(127, 170, 244);
    color: transparent;
    position: fixed; /* Fixed position for floating effect */
    top: 20px; /* Position from the top */
    left: 20px; /* Position from the left */
}


.float-button:hover {
    background-color: rgb(127, 170, 244); /* Light blue background */
    color: white; /* White font color */
    border: none; /* Remove default border */
    border-radius: 12px; /* Slightly rounded borders */
    width: 520px; /* Width of the button */
    height: 100px; /* Height of the button */
    display: flex; /* Center the content */
    flex-direction: column; /* Stack the content vertically */
    padding-left: 10px; /* Add left padding */
    justify-content: center; /* Center the content vertically */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Optional shadow for a floating effect */
    position: fixed; /* Fixed position for floating effect */
    top: 20px; /* Position from the top */
    left: 20px; /* Position from the left */
    font-size: 16px; /* Font size */
    text-align: left; /* Center text inside the button */
    color: white; /* White font color */
    z-index: 1001; /* Set the button above other elements */
}
      `}
      
      
      </style>
    </div>
  );
}
