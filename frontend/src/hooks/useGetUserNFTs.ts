import { useState, useEffect, useContext } from "react";
import { Address } from "wagmi";
import { Store } from "../providers/Store";

interface NFT {
    tokenId: number;
    tokenURI: string;
  }

export const useGetUserNFTs = (address: Address) => {
  const { contractStore } = useContext(Store);
  const { sloth_nft } = contractStore;
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    async function getUserBalance() {
      return await sloth_nft.read.balanceOf(address);
    }

    async function getUserNFTs() {
      const userBalance = Number(await getUserBalance());
      const newUserNFTs = [];

      for (let i = 0; i < userBalance; i++) {
        const tokenId = Number(await sloth_nft.read.tokenOfOwnerByIndex(address, i));
        const [tokenURI] = await Promise.all([
          sloth_nft.read.tokenURI(tokenId),
          // sloth_nft.write.tokenMetadata(tokenId)
        ]);

        newUserNFTs.push({ tokenId: tokenId, tokenURI: tokenURI });
      }

      setUserNFTs(newUserNFTs);
    }

    if (address) {
      getUserNFTs();
    } else {
      setUserNFTs([]);
    }
  }, [address, sloth_nft]);

  return userNFTs;
};