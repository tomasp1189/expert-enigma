import { useState, useEffect, useContext } from "react";
import { Store } from "../providers/Store";

interface NFT {
  tokenId: number;
  tokenURI: string;
}

export const useGetNFTByTokenID = (tokenId: number) => {
  const {  contractStore } = useContext(Store);
  const { sloth_nft } = contractStore;
  const [nft, setNFT] = useState<NFT | null>(null);

  useEffect(() => {
    async function getNFT() {
      if (tokenId !== null && tokenId !== undefined) {
        try {
          const tokenURI = await sloth_nft.read.tokenURI(tokenId);
          setNFT({ tokenId: tokenId, tokenURI: tokenURI });
        } catch (error) {
          console.error("Error fetching NFT:", error);
          setNFT(null);
        }
      } else {
        setNFT(null);
      }
    }

    getNFT();
  }, [tokenId, sloth_nft]);

  return nft;
};