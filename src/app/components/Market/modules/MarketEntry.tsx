"use client";

import { FunctionComponent, JSX } from "react";
import { useRouter } from "next/navigation";
import useMarket from "../hooks/useMarket";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatUnits } from "viem";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const MarketEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const router = useRouter();
  const { packsLoading, packs, hasMorePacks, loadMorePacks } = useMarket();

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-4 justify-start items-center">
            <div className="stamp-grid-background"></div>

            <div className="flex flex-col gap-4 p-4 items-center justify-start relative w-full">
              <div>
                <h1 className="stamp-title">{dict?.market?.title}</h1>
              </div>
            </div>

            <div
              id="market-scroll"
              className="w-full flex flex-col gap-0 relative h-fit overflow-y-auto"
            >
              <InfiniteScroll
                dataLength={packs.length}
                next={loadMorePacks}
                hasMore={hasMorePacks}
                loader={
                  <div className="text-center py-2 text-xs w-full">
                    {packsLoading ? dict?.market?.loading : ""}
                  </div>
                }
                scrollableTarget="market-scroll"
              >
                {packs.length > 0 ? (
                  packs.map((pack, index) => (
                    <div
                      className="relative w-fit flex cursor-pointer"
                      key={index}
                      onClick={() =>
                        router.push(`/reaction-pack/${pack.packId}`)
                      }
                    >
                      <div className="w-80 relative flex">
                        <div className="stamp-border w-full relative flex h-full">
                          <div className="stamp-content-wrapper p-3 flex flex-col gap-3 relative">
                            {pack.packMetadata?.image && (
                              <div className="w-full h-80 flex relative">
                                <Image
                                  fill
                                  src={
                                    pack.packMetadata.image?.includes("ipfs://")
                                      ? `${INFURA_GATEWAY}/ipfs/${
                                          pack.packMetadata.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`
                                      : pack.packMetadata.image
                                  }
                                  alt={pack.packMetadata.title}
                                  objectFit="contain"
                                  draggable={false}
                                />
                              </div>
                            )}

                            <div className="relative w-full gap-2 flex flex-col">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-aza line-clamp-1">
                                  {pack.packMetadata?.title ||
                                    dict?.designer?.unnamedPack}
                                </div>
                                <div
                                  className={`text-xs font-aza ${
                                    pack.active === true
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  #{pack.packId}{" "}
                                  {pack.active === true
                                    ? dict?.designer?.active
                                    : dict?.designer?.inactive}
                                </div>
                              </div>

                              <div className="flex flex-row flex-wrap w-full h-fit relative gap-2 justify-between items-center text-xs font-aza">
                                <div className="relative w-fit h-fit flex flex-col">
                                  <div className="text-sm font-brass">
                                    {formatUnits(
                                      BigInt(pack.currentPrice || 0),
                                      18
                                    )}{" "}
                                    MONA
                                  </div>
                                  <div className="text-gray-600">
                                    {dict?.designer?.price}
                                  </div>
                                </div>
                                <div className="relative w-fit h-fit flex flex-col">
                                  <div className="text-sm font-brass">
                                    {pack.soldCount}/{pack.maxEditions}
                                  </div>
                                  <div className="text-gray-600">
                                    {dict?.designer?.sold}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-xs font-aza gap-5 flex-wrap">
                                <div className="text-gray-600">
                                  {pack.reactions?.length || 0}{" "}
                                  {dict?.designer?.reactions}
                                </div>
                                {pack.reactions &&
                                  pack.reactions.length > 0 && (
                                    <div className="flex gap-1 flex-wrap">
                                      {pack.reactions
                                        .slice(0, 6)
                                        .map((reaction, rIdx: number) => (
                                          <div
                                            key={rIdx}
                                            className="w-5 h-5 relative border border-gray-200"
                                          >
                                            <Image
                                              fill
                                              src={
                                                reaction.reactionMetadata?.image?.includes(
                                                  "ipfs://"
                                                )
                                                  ? `${INFURA_GATEWAY}/ipfs/${
                                                      reaction.reactionMetadata.image?.split(
                                                        "ipfs://"
                                                      )?.[1]
                                                    }`
                                                  : reaction.reactionMetadata
                                                      ?.image
                                              }
                                              alt={
                                                reaction.reactionMetadata
                                                  ?.title || "reaction"
                                              }
                                              className="object-cover"
                                              draggable={false}
                                            />
                                          </div>
                                        ))}
                                      {pack.reactions.length > 6 && (
                                        <div className="w-5 h-5 border border-gray-200 flex items-center justify-center bg-gray-100">
                                          <span className="text-xs text-gray-500">
                                            +
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : !packsLoading ? (
                  <div className="text-center py-8 text-xs text-gray-600 w-full">
                    {dict?.market?.noPacksAvailable}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-gray-600 w-full">
                    {dict?.market?.loadingPacks}
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketEntry;
