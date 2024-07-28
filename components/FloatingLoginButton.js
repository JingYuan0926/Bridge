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

  const handleRefresh = () => {
    if (zkLoginUserAddress) {
      fetchBalance(zkLoginUserAddress);
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
          <div className="button-container">
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <button onClick={handleRefresh} className="refresh-button">Refresh</button>
          </div>
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

        .button-container {
          display: flex;
          gap: 10px;
        }

        .logout-button,
        .refresh-button {
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

        .float-button:hover .logout-button,
        .float-button:hover .refresh-button {
          background-color: #FF6347;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          margin-top: 10px;
        }

        .float-button:hover img {
          display: none;
        }

        .logout-button:hover {
          background-color: #FF4500;
        }

        .refresh-button:hover {
          background-color: #32CD32;
        }
      `}</style>
    </div>
  );
}
