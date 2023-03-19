import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createClient, mainnet, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const localChain: Chain = {
  id: 31337,
  name: 'Localhost 8545',
  network: 'localhost',
  nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
  },
  rpcUrls: {
      default: {
        http: ['http://localhost:8545'],
        webSocket: [''],
  },
  public: {
        http: ['http://localhost:8545'],
        webSocket: [''],
  },
  },
};

const { chains, provider } = configureChains(
  [localChain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
    <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
