import { useState, useEffect } from "react";
import { SlothNFT } from "../constants/types";

export const useGetAllNFTs = (contract: any) => {
  const [allNFTs, setAllNFTs] = useState<SlothNFT[]>([]);

  useEffect(() => {
    async function getTotalSupply() {
      return await contract.read.totalSupply();
    }

    async function getAllNFTs() {
      const totalSupply = Number(await getTotalSupply());
      const newAllNFTs = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = Number(await contract.read.tokenByIndex(i));
        const [tokenURI] = await Promise.all([
            contract.read.tokenURI(tokenId),
          // contract.write.tokenMetadata(tokenId)
        ]);

        newAllNFTs.push({ tokenId: tokenId, tokenURI: tokenURI });
      }

      setAllNFTs(newAllNFTs);
    }

    getAllNFTs();
  }, [contract]);

  return allNFTs;
};