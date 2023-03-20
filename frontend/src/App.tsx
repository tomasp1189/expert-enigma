import { Container, Box, Stack } from '@mui/material';
import { MintModal } from './components/MintModal';
import { NFTsModal } from './components/NFTsModal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { Store } from './providers/Store';
import { NFTDetailsModal } from './components/NFTDetailsModal';
import usePrepareContracts from './hooks/usePrepareContracts';
import { useState } from 'react';
import { useGetAllNFTs } from './hooks/useGetAllNFTs';

function App() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {data: signer } = useSigner();
  const provider = useProvider();
  const contractStore = usePrepareContracts(provider, signer);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);
  const allNFTs = useGetAllNFTs(contractStore.sloth_nft);
  const userStore = {
    address,
    chain,
    signer,
    provider,
    allNFTs,
    userNFTs,
    setUserNFTs,
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
        <Stack sx={{
          p: 4,
          gap: 2,
        }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'end',

        }}>
        <ConnectButton />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
          gap: 2,
        }}>
          <MintModal />
          <NFTsModal />
          <NFTDetailsModal />
        </Box>
        </Stack>
      </Container>
      </Store.Provider>

  );
}

export default App;