import { useEffect, useState } from "react";
import { Purchase } from "../../Common/types/common.types";
import { useAccount, usePublicClient } from "wagmi";
import { getPurchases } from "@/app/lib/queries/subgraph/getPurchases";
import { DUMMY_PURCHASES } from "@/app/lib/dummy";

const usePurchases = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [purchasesLoading, setPurchasesLoading] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [hasMorePurchases, setHasMorePurchases] = useState<boolean>(true);

  const getBuyerPurchases = async (
    skip: number = 0,
    reset: boolean = false
  ) => {
    if (purchasesLoading || !address) return;
    setPurchasesLoading(true);
    try {
      const limit = 20;
      const data = await getPurchases(address, limit, skip);
      const newPurchases =
        data?.data?.purchases?.length < 1
          ? DUMMY_PURCHASES
          : data?.data?.purchases;

      if (reset) {
        setPurchases(newPurchases);
      } else {
        setPurchases((prev) => [...prev, ...newPurchases]);
      }

      setHasMorePurchases(newPurchases.length === limit);
    } catch (err: any) {
      console.error(err.message);
    }
    setPurchasesLoading(false);
  };

  const loadMorePurchases = () => {
    if (hasMorePurchases && !purchasesLoading) {
      getBuyerPurchases(purchases.length, false);
    }
  };

  useEffect(() => {
    if (address && purchases.length < 1 && publicClient && !purchasesLoading) {
      getBuyerPurchases(0, true);
    }
  }, [address]);

  return {
    purchasesLoading,
    purchases,
    hasMorePurchases,
    loadMorePurchases,
  };
};

export default usePurchases;
