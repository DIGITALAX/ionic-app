import { useEffect, useState } from "react";
import { NFT } from "../../Common/types/common.types";
import { getOneNFT } from "@/app/lib/queries/subgraph/getNFTs";
import { fetchMetadata } from "@/app/lib/utils";
import { usePublicClient } from "wagmi";

const useNFT = (nftContract: string | undefined, nftId: number | undefined) => {
  const publicClient = usePublicClient();
  const [nft, setNFT] = useState<NFT | undefined>();
  const [nftLoading, setNftLoading] = useState<boolean>(false);

  const getNFT = async () => {
    if (!nftContract || !nftId || !publicClient) return;
    setNftLoading(true);
    try {
      const data = await getOneNFT(nftContract, nftId);
      let nftData = data?.data?.nfts;

      nftData = await fetchMetadata(nftData, publicClient);
      setNFT(nftData?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
    setNftLoading(false);
  };

  useEffect(() => {
    if (nftId && nftContract && publicClient) {
      getNFT();
    }
  }, [nftId, nftContract, publicClient]);

  return {
    nftLoading,
    nft,
  };
};

export default useNFT;
