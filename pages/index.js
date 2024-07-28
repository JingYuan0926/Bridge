import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAddress = localStorage.getItem('zkLoginUserAddress');
    if (storedAddress) {
      setZkLoginUserAddress(storedAddress);
      fetchBalance(storedAddress);
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
    setIsLoading(true);
    const CLIENT_ID = '3502125623-fje9pvbvcuet45krmcr0v1433turot75.apps.googleusercontent.com';
    const REDIRECT_URL = 'http://localhost:3000/callback';
    const nonce = Math.random().toString(36).substring(2, 15);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid email&nonce=${nonce}`;
    router.push(authUrl);
  };

  const handleLogout = () => {
    localStorage.removeItem('zkLoginUserAddress');
    setZkLoginUserAddress(null);
    setBalance(null);
  };

  return (
    <div>
      <h1>zkLogin with Sui</h1>
      {!zkLoginUserAddress && (
        <button 
          onClick={startOAuthFlow} 
          disabled={isLoading}
          style={{ padding: '10px 20px', fontSize: '16px', margin: '20px' }}
        >
          {isLoading ? 'Logging in...' : 'Login with Google'}
        </button>
      )}
      {zkLoginUserAddress && (
        <div>
          <p>Your zkLogin Sui Address: {zkLoginUserAddress}</p>
          {balance !== null && (
            <p>Balance: {balance} SUI</p>
          )}
          <button 
            onClick={handleLogout}
            style={{ padding: '10px 20px', fontSize: '16px', margin: '20px' }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}