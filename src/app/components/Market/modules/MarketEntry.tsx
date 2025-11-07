"use client";

import { FunctionComponent, JSX } from "react";
import { useRouter } from "next/navigation";
import useMarket from "../hooks/useMarket";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatUnits } from "viem";

const MarketEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const router = useRouter();
  const { packsLoading, packs, hasMorePacks, loadMorePacks } = useMarket();

  return (
    <div className="w-full max-w-6xl mx-auto p-3">
      <div className="border border-black p-3 mb-3">
        <h1 className="text-lg mb-1">{dict?.market?.title}</h1>
        <p className="text-sm text-gray-600">{dict?.market?.description}</p>
      </div>

      <div id="market-scroll" className="max-h-screen overflow-auto border border-black border-t-0">
        <InfiniteScroll
          dataLength={packs.length}
          next={loadMorePacks}
          hasMore={hasMorePacks}
          loader={
            <div className="text-center py-2 text-xs">
              {packsLoading ? dict?.market?.loading : ""}
            </div>
          }
          scrollableTarget="market-scroll"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
            {packs.map((pack, index) => (
              <div
                key={`${pack.packId}-${index}`}
                onClick={() => router.push(`/reaction-pack/${pack.packId}`)}
                className="border border-gray-300 hover:border-black transition-colors cursor-pointer p-2"
              >
                <div className="w-full h-32 relative border border-gray-300 mb-2">
                  <Image
                    fill
                    src={pack.packMetadata?.image}
                    alt={pack.packMetadata?.title}
                    className="object-cover"
                    draggable={false}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm line-clamp-1">{pack.packMetadata?.title}</h3>
                  
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {pack.packMetadata?.description || dict?.market?.noDescription}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 relative rounded-full overflow-hidden border border-gray-300">
                      <Image
                        fill
                        src={pack.designerProfile?.metadata?.image}
                        alt={pack.designerProfile?.metadata?.title}
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-1 flex-1">
                      {pack.designerProfile?.metadata?.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div >{formatUnits(BigInt(pack.currentPrice), 18)} MONA</div>
                      <div className="text-gray-600">Price</div>
                    </div>
                    <div>
                      <div >{pack.soldCount}/{pack.maxEditions}</div>
                      <div className="text-gray-600">Sold</div>
                    </div>
                  </div>

                  {pack.reactions && pack.reactions.length > 0 && (
                    <div className="flex gap-1">
                      {pack.reactions.slice(0, 8).map((reaction, idx) => (
                        <div key={`${reaction.reactionId}-${idx}`} className="w-3 h-3 relative border border-gray-200">
                          <Image
                            fill
                            src={reaction.reactionMetadata?.image}
                            alt={reaction.reactionMetadata?.title}
                            className="object-cover"
                            draggable={false}
                          />
                        </div>
                      ))}
                      {pack.reactions.length > 8 && (
                        <div className="w-3 h-3 border border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">+</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>

        {packs.length === 0 && !packsLoading && (
          <div className="text-center py-8 text-xs text-gray-600">
            {dict?.market?.noPacksAvailable}
          </div>
        )}

        {packsLoading && packs.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-600">
            {dict?.market?.loadingPacks}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketEntry;
