import { Container, Box } from '@mui/material';
import { MintModal } from './components/MintModal';
import { NFTsModal } from './components/NFTsModal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { Store } from './providers/Store';
import { NFTDetailsModal } from './components/NFTDetailsModal';
import usePrepareContracts from './hooks/usePrepareContracts';
import { useState } from 'react';

function App() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {data: signer } = useSigner();
  const provider = useProvider();
  const contractStore = usePrepareContracts(provider, signer);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState();
  const userStore = {
    address,
    chain,
    signer,
    provider,
    selectedTokenId,
    setSelectedTokenId,
    showDetailsModal,
    setShowDetailsModal,
  };
  
  

  return (
    <Store.Provider value={{userStore, contractStore}}>
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
        <Box sx={{
          display: 'flex',
          gap: 2,
        }}>
          <MintModal />
          <NFTsModal />
          <NFTDetailsModal />
        </Box>
      </Container>
      </Store.Provider>

  );
}

export default App;