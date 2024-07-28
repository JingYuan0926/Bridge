import { useState, useEffect } from 'react';

export default function FloatingLoginButton({ onLogin }) {
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const storedAddress = localStorage.getItem('zkLoginUserAddress');
    if (storedAddress) {
      setZkLoginUserAddress(storedAddress);
      fetchBalance(storedAddress);
      if (onLogin) {
        onLogin(storedAddress);
      }
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
      if (onLogin) {
        onLogin(data.address);
      }
    } catch (error) {
      console.error('Error handling auth response:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zkLoginUserAddress');
    setZkLoginUserAddress(null);
    setBalance(null);
    if (onLogin) {
      onLogin(null);
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
          <img src="data:image/png;base64,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" alt="SUI Logo" width="50" height="50" />
          <p>Your Sui Address: {zkLoginUserAddress}</p>
          {balance !== null && (
            <p>Balance: {balance} SUI</p>
          )}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}
      <style jsx>{`
        .float-button {
          width: 120px;
          height: 50px;
          border-radius: 12px;
          background-color: #4CA2FF;
          position: fixed;
          top: 20px;
          left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          padding: 10px;
          transition: all 0.3s ease;
          color: transparent;
        }
        
        .float-button img {
          margin-top: 85px;
          margin-left: 30px;
      }

        .logout-button{
          background-color: transparent;
          color: transparent;
          border: none;
        }

        .float-button:hover {
          background-color: #87CEEB;
          width: 550px;
          height: auto;
          padding: 20px;
          color: white;

        }

        .float-button p {
          margin: 0;
        }

        .float-button:hover .logout-button {
          background-color: #FF6347;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          margin-top: 10px;
        }

        .float-button:hover img{
        display: none;}

        .logout-button:hover {
          background-color: #FF4500;
        }
      `}</style>
    </div>
  );
}
