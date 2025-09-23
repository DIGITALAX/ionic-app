"use client";

import { FunctionComponent, JSX } from "react";
import usePurchases from "../hooks/usePurchases";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { getCurrentNetwork } from "@/app/lib/constants";
import { useRouter } from "next/navigation";

const PurchasesTab: FunctionComponent<{dict: any}> = ({dict}): JSX.Element => {
  const { purchases, purchasesLoading, hasMorePurchases, loadMorePurchases } =
    usePurchases();
  const router = useRouter();
  const network = getCurrentNetwork();

  const formatPrice = (price: string) => {
    const eth = parseFloat(price) / 1e18;
    return `${eth.toFixed(4)} MONA`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border border-black p-3">
      <div className="text-base font-medium mb-3">{dict?.account?.purchases?.title}</div>

      <div id="purchases-scroll" className="h-64 overflow-auto border border-gray-300">
        <InfiniteScroll
          dataLength={purchases.length}
          next={loadMorePurchases}
          hasMore={hasMorePurchases}
          loader={
            <div className="text-center py-2 text-xs">
              {purchasesLoading ? dict?.account?.purchases?.loadingPurchases : ""}
            </div>
          }
          scrollableTarget="purchases-scroll"
        >
          <div className="space-y-1 p-2">
            {purchases.map((purchase) => (
              <div
                key={purchase.purchaseId}
                className="border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/reaction-pack/${purchase.packId}`)}
              >
                <div className="flex gap-2">
                  <div className="w-10 h-10 relative border border-gray-200">
                    <Image
                      fill
                      draggable={false}
                      src={purchase.pack.packMetadata.image}
                      alt={purchase.pack.packMetadata.title}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium">
                        {purchase.pack.packMetadata.title}
                      </span>
                      <span className="text-xs text-gray-600">
                        {formatPrice(purchase.price)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {dict?.account?.purchases?.purchase} #{purchase.purchaseId} • {dict?.account?.purchases?.edition} #
                      {purchase.editionNumber}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{formatDate(purchase.timestamp)}</span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `${network.blockExplorer}/tx/${purchase.transactionHash}`
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {dict?.account?.purchases?.viewTransaction}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {purchases.length === 0 && !purchasesLoading && (
              <div className="text-center py-6 text-xs text-gray-600">
                {dict?.account?.purchases?.noPurchases}
              </div>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PurchasesTab;
