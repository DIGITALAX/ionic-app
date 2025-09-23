import { useEffect, useState } from "react";
import { NFT } from "../../Common/types/common.types";
import { getOneNFT } from "@/app/lib/queries/subgraph/getNFTs";
import { DUMMY_NFTS, DUMMY_APPRAISALS, DUMMY_CONDUCTOR } from "@/app/lib/dummy";

const useNFT = (nftContract: string | undefined, nftId: number | undefined) => {
  const [nft, setNFT] = useState<NFT | undefined>();
  const [nftLoading, setNftLoading] = useState<boolean>(false);

  const getNFT = async () => {
    if (!nftContract || !nftId) return;
    setNftLoading(true);
    try {
      const data = await getOneNFT(nftContract, nftId);
      let nftData = data?.data?.nfts?.[0];
      
      if (!nftData) {
        const dummyNft = DUMMY_NFTS[0];
        if (dummyNft) {
          nftData = {
            ...dummyNft,
            appraisals: DUMMY_APPRAISALS.map(a => ({
              ...a,
              conductor: DUMMY_CONDUCTOR
            }))
          };
        }
      }
      
      setNFT(nftData);
    } catch (err: any) {
      console.error(err.message);
    }
    setNftLoading(false);
  };

  useEffect(() => {
    if (nftId && nftContract) {
      getNFT();
    }
  }, [nftId, nftContract]);

  return {
    nftLoading,
    nft,
  };
};

export default useNFT;
