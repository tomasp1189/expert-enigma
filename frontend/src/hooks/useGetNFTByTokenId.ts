import { useState, useEffect, useContext } from "react";
import { Store } from "../providers/Store";
import { SlothNFT } from "../constants/types";

export const useGetNFTByTokenId = (tokenId: number) => {
  const { userStore } = useContext(Store);
  const { allNFTs } = userStore;
  const [NFT, setNFT] = useState<SlothNFT | null>(null);

  useEffect(() => {
    function getNFT() {
      if (tokenId) {
        try {
          const foundNFT = allNFTs.find((NFT: SlothNFT) => NFT.tokenId === tokenId);
          if (foundNFT) {
            setNFT(foundNFT);
          } else {
            console.error("NFT not found");
            setNFT(null);
          }
        } catch (error) {
          console.error("Error fetching NFT:", error);
          setNFT(null);
        }
      } else {
        setNFT(null);
      }
    }

    getNFT();
  }, [tokenId, allNFTs]);

  return NFT;
};


