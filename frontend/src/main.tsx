import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
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

const buildBearChain: Chain = {
  id: 8529,
  name: 'BuildBear',
  network: 'buildbear',
  nativeCurrency: {
      name: 'Ether',
      symbol: 'BB ETH',
      decimals: 18,
  },
  rpcUrls: { default: { http: ['https://rpc.buildbear.io/Boring_Rugor_Nass_90b2108e'], webSocket: [''] },
  public: { http: ['https://rpc.buildbear.io/Boring_Rugor_Nass_90b2108e'], webSocket: [''] },
  },
  blockExplorers: {
      default: {
        name: 'BuildBear',
        url: 'https://explorer.buildbear.io/Boring_Rugor_Nass_90b2108e'
      },
      public: {
        name: 'BuildBear',
        url: 'https://explorer.buildbear.io/Boring_Rugor_Nass_90b2108e'
      },
  },
};


const { chains, provider } = configureChains(
  [localChain, buildBearChain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Slothagotchi',
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
