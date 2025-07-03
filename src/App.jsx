import React from 'react';
import { UALProvider } from 'ual-reactjs-renderer';
import { Anchor } from 'ual-anchor';
import AnchorLogin from './AnchorLogin.jsx';

const chains = [
  {
    chainId: '1064487b3cd1a89764f368dff1a53f8f26f73d94759a4a179f76f05e4e09d5b6',
    rpcEndpoints: [{ protocol: 'https', host: 'wax.greymass.com', port: '' }],
  },
];

// Внимание — вторым параметром объект с appName
const anchor = new Anchor(chains, { appName: 'Wax Game' });

export default function App() {
  return (
    <UALProvider chains={chains} authenticators={[anchor]} appName="Wax Game">
      <AnchorLogin />
    </UALProvider>
  );
}
