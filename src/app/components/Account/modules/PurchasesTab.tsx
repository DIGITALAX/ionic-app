"use client";

import { FunctionComponent, JSX } from "react";
import usePurchases from "../hooks/usePurchases";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import {
  formatAddress,
  formatDate,
  getExplorerUrl,
} from "@/app/lib/helpers/getExplorerUrl";
import { formatUnits } from "viem";

const PurchasesTab: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { purchases, purchasesLoading, hasMorePurchases, loadMorePurchases } =
    usePurchases();
  const router = useRouter();
  const network = getCurrentNetwork();

  const formatPrice = (price: string) => {
    const eth = parseFloat(price) / 1e18;
    return `${eth.toFixed(4)} MONA`;
  };

  return (
    <div className="p-3 relative w-full flex flex-col gap-2 items-start justify-start">
      <div className="text-base mb-3">{dict?.account?.purchases?.title}</div>

      {purchases?.length > 0 ? (
        <div id="purchases-scroll" className="h-64 overflow-auto w-full">
          <InfiniteScroll
            dataLength={purchases?.length}
            next={loadMorePurchases}
            hasMore={hasMorePurchases}
            loader={
              <div className="text-center py-2 text-xs">
                {purchasesLoading
                  ? dict?.account?.purchases?.loadingPurchases
                  : ""}
              </div>
            }
            scrollableTarget="purchases-scroll"
          >
            <div className="space-y-1 p-2  w-full">
              {purchases.map((purchase) => (
                <div
                  key={`${purchase.purchaseId}`}
                  className="border border-gray-200 p-3 bg-white/70 items-start justify-start w-full"
                >
                  <div className="flex justify-between gap-4 flex-row items-start mb-2 flex-wrap">
                    <div className="text-xs font-aza relative flex flex-col gap-1 text-left items-start justify-start">
                      <div>
                        {dict?.reactionPack?.edition} #{purchase.editionNumber}
                      </div>
                      <div
                        className="flex w-fit h-fit cursor-pointer relative"
                        onClick={() =>
                          router.push(`/reaction-pack/${purchase.packId}`)
                        }
                      >
                        <div className="w-12 h-12 relative shrink-0">
                          <Image
                            fill
                            src={`${INFURA_GATEWAY}/ipfs/${
                              purchase?.pack?.packMetadata?.image?.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                            alt={purchase?.pack?.packMetadata?.title}
                            objectFit="contain"
                            draggable={false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs font-aza">
                      <div className="font-brass">
                        {formatUnits(BigInt(purchase.price), 18)} MONA
                      </div>
                      <div className="text-gray-600">
                        {formatDate(purchase.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 font-mid w-fit h-fit flex flex-col items-start justify-start">
                    <div>
                      {dict?.reactionPack?.shareWeight}: {purchase.shareWeight}
                    </div>
                    <div className="break-all">
                      {dict?.reactionPack?.tx}:
                      <button
                        onClick={() =>
                          window.open(
                            getExplorerUrl(network, purchase.transactionHash)
                          )
                        }
                        className="text-gray-600 hover:text-black underline hover:no-underline transition-all ml-1"
                      >
                        {formatAddress(purchase.transactionHash)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      ) : (
        <div className="relative flex w-fit h-fit text-xs text-gray-600">
          {dict?.account?.purchases?.noPurchases}
        </div>
      )}
      <div className="relative w-full h-full min-h-72 flex mt-4">
        <Image
          layout="fill"
          objectFit="cover"
          src={"/images/agua.png"}
          draggable={false}
          alt="Cows"
        />
      </div>
    </div>
  );
};

export default PurchasesTab;
