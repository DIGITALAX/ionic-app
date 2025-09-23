import { useEffect, useState } from "react";
import { ReactionPack } from "../../Common/types/common.types";
import { getAllReactions } from "@/app/lib/queries/subgraph/getReactions";
import { DUMMY_PACKS } from "@/app/lib/dummy";

const useMarket = () => {
  const [packsLoading, setPacksLoading] = useState<boolean>(false);
  const [packs, setPacks] = useState<ReactionPack[]>([]);
  const [hasMorePacks, setHasMorePacks] = useState<boolean>(true);

  const getPacks = async (skip: number = 0, reset: boolean = false) => {
    setPacksLoading(true);
    try {
      const limit = 20;
      const data = await getAllReactions(limit, skip);
      const newPacks = data?.data?.reactionPacks || [];
      
      if (newPacks.length === 0 && skip === 0) {
        setPacks(DUMMY_PACKS);
        setHasMorePacks(false);
      } else {
        if (reset) {
          setPacks(newPacks);
        } else {
          setPacks(prev => [...prev, ...newPacks]);
        }
        setHasMorePacks(newPacks.length === limit);
      }
    } catch (err: any) {
      console.error(err.message);
      if (skip === 0) {
        setPacks(DUMMY_PACKS);
        setHasMorePacks(false);
      }
    }
    setPacksLoading(false);
  };

  const loadMorePacks = () => {
    if (!packsLoading && hasMorePacks) {
      getPacks(packs.length);
    }
  };

  useEffect(() => {
    getPacks(0, true);
  }, []);

  return {
    packsLoading,
    packs,
    hasMorePacks,
    loadMorePacks
  };
};

export default useMarket;
