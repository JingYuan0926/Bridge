import React, { useState, useEffect } from 'react';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';

const MNEMONIC = 'melody earth grocery front rug purpose into define fit body secret sense';
const DERIVATION_PATH = `m/44'/784'/0'/0'/0'`;
const TRANSFER_AMOUNT = 1000000; // 0.001 SUI in MIST

const TransferFunds = ({ userAddress, onTransferComplete }) => {
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        transferFunds();
    }, []);

    const transferFunds = async () => {
        setIsLoading(true);
        setStatus('Initiating transfer...');

        try {
            const keypair = Ed25519Keypair.deriveKeypair(MNEMONIC, DERIVATION_PATH);
            const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

            const tx = new TransactionBlock();
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(TRANSFER_AMOUNT)]);
            tx.transferObjects([coin], tx.pure(userAddress));

            const result = await client.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
            });

            setStatus(`Transfer successful! Transaction digest: ${result.digest}`);
            alert(`Transfer successful! Transaction digest: ${result.digest}`);
            console.log('Transaction result:', result);
            console.log('Sender address:', keypair.getPublicKey().toSuiAddress());
            
            // Call the onTransferComplete callback to trigger balance refresh
            if (onTransferComplete) {
                onTransferComplete();
            }
        } catch (error) {
            console.error('Transfer error:', error);
            setStatus(`Transfer failed: ${error.message}`);
            alert(`Transfer failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return null; // No need to render anything
};

export default TransferFunds;
