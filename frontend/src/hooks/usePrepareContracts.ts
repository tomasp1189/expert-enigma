import { useContract } from 'wagmi';
import { contractData } from '../constants/contractData';

export const usePrepareContracts = (provider: any, signer: any) => {
    const preparedContracts = {
    sloth_nft: {
      read: useContract({address: contractData.sloth_nft.address, abi: contractData.sloth_nft.abi, signerOrProvider: provider}),
      write: useContract({address: contractData.sloth_nft.address, abi: contractData.sloth_nft.abi, signerOrProvider:signer}),
    },
    sloth_token: {
      read: useContract({address: contractData.sloth_token.address, abi: contractData.sloth_token.abi, signerOrProvider: provider}),
      write: useContract({address: contractData.sloth_token.address, abi: contractData.sloth_token.abi, signerOrProvider:signer}),
    },
    sloth_farming: {
      read: useContract({address: contractData.sloth_farming.address, abi: contractData.sloth_farming.abi, signerOrProvider: provider}),
      write: useContract({address: contractData.sloth_farming.address, abi: contractData.sloth_farming.abi, signerOrProvider:signer}),
    },
    }
    
    return preparedContracts;
}

export default usePrepareContracts;
    
    