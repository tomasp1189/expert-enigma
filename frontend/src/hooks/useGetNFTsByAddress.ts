import { useState, useEffect, useContext } from "react";
import { Store } from "../providers/Store";
import { SlothNFT } from "../constants/types";

export const useGetNFTsByAddress = (address: any) => {
  const { userStore, contractStore } = useContext(Store);
  const { allNFTs } = userStore;
  const { sloth_nft } = contractStore;
  const [userNFTs, setUserNFTs] = useState<SlothNFT[]>([]);

  useEffect(() => {
    async function getUserBalance() {
      return await sloth_nft.read.balanceOf(address);
    }

    async function getUserNFTs() {
      const userBalance = Number(await getUserBalance());
      
      const fetchTokenIds = async () => {
        const promises = [];
        for (let i = 0; i < userBalance; i++) {
          promises.push(sloth_nft.read.tokenOfOwnerByIndex(address, i));
        }
        return Promise.all(promises);
      };

      const tokenIds = await fetchTokenIds();
      const newUserNFTs = tokenIds.map(tokenId => allNFTs.find((NFT:SlothNFT) => NFT.tokenId === Number(tokenId))).filter(Boolean);

      setUserNFTs(newUserNFTs);
    }

    if (address) {
      getUserNFTs();
    } else {
      setUserNFTs([]);
    }
  }, [address, sloth_nft, allNFTs]);

  return userNFTs;
};