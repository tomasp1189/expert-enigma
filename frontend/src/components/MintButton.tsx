import { Button } from '@mui/material';
import { useContext } from 'react';
import { useWriteContract } from '../hooks/useWriteContract'
import { Store } from '../providers/Store';

export const MintButton = () => {
  const { userStore } = useContext(Store)

  const  writeContract  = useWriteContract(
    'sloth_nft',
    'mintItem',
    [userStore.address, '']
  );

  return (
    <Button variant="contained" color="primary" onClick={writeContract}>
      Mint NFT
    </Button>
  );
};