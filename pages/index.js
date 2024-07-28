// index.js
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import TransferFunds from '../components/TransferFund';

export default function Home() {
    const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const newProvider = new SuiClient({ url: getFullnodeUrl('testnet') });
        setProvider(newProvider);
    }, []);

    const fetchBalance = useCallback(async (address) => {
        if (!provider) return;
        try {
            const balance = await provider.getBalance({
                owner: address,
            });
            const balanceInSui = Number(balance.totalBalance) / 1000000000;
            setBalance(balanceInSui.toFixed(5));
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance('Error fetching balance');
        }
    }, [provider]);

    useEffect(() => {
        if (zkLoginUserAddress) {
            fetchBalance(zkLoginUserAddress);
        }
    }, [zkLoginUserAddress, fetchBalance]);

    const startOAuthFlow = async () => {
        setIsLoading(true);
        const CLIENT_ID = '3502125623-fje9pvbvcuet45krmcr0v1433turot75.apps.googleusercontent.com';
        const REDIRECT_URL = 'http://localhost:3000/callback';
        const nonce = Math.random().toString(36).substring(2, 15);
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid email&nonce=${nonce}`;
        router.push(authUrl);
    };

    const handleLogin = () => {
        const storedAddress = localStorage.getItem('zkLoginUserAddress');
        if (storedAddress) {
            setZkLoginUserAddress(storedAddress);
        } else {
            startOAuthFlow();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('zkLoginUserAddress');
        setZkLoginUserAddress(null);
        setBalance(null);
    };

    const handleTransferComplete = () => {
        if (zkLoginUserAddress) {
            fetchBalance(zkLoginUserAddress);
        }
    };

    return (
        <div>
            <h1>zkLogin with Sui</h1>
            {!zkLoginUserAddress && (
                <button
                    onClick={handleLogin}
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
                    <TransferFunds 
                        userAddress={zkLoginUserAddress} 
                        onTransferComplete={handleTransferComplete}
                    />
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
