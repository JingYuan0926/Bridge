import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    try {
      const faucetHost = getFaucetHost('testnet');
      console.log('Faucet host:', faucetHost);
      console.log('Requesting funds for address:', address);

      const result = await requestSuiFromFaucetV0({
        host: faucetHost,
        recipient: address,
      });

      console.log('Faucet result:', result);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Faucet error:', error);
      res.status(500).json({ error: 'Failed to request funds from faucet', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
