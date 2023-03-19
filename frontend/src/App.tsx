import { createContext, useContext, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { MintModal } from './components/MintModal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { Store } from './providers/Store';

function App() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {data: signer } = useSigner();
  const provider = useProvider();


  const userStore = {
    address,
    chain,
    signer,
    provider,
  };

  return (
    <Store.Provider value={{userStore}}>
      <Container sx={{
                backgroundImage: 'url("map.webp")',
                height: '100vh',
      }} >
        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
          width: '100%',
          pt: 4,
          pr: 4,
        }}>
        <ConnectButton />
        </Box>
          <MintModal />
      </Container>
      </Store.Provider>

  );
}

export default App;