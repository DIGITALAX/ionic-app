"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useState } from "react";
import usePack from "../hooks/usePack";
import Image from "next/image";
import { formatUnits } from "viem";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import {
  formatAddress,
  formatDate,
  getExplorerUrl,
} from "@/app/lib/helpers/getExplorerUrl";

const ReactionPackEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { pack: packId } = useParams();
  const {
    pack,
    packLoading,
    handlePurchasePack,
    purchaseLoading,
    handleApprove,
    approveLoading,
    hasAllowance,
    isInReservedPhase,
    isConductor,
  } = usePack(Number(packId), dict);
  const router = useRouter();
  const network = getCurrentNetwork();
  const [isRevenueTableExpanded, setIsRevenueTableExpanded] = useState(false);

  const generatePriceChartData = () => {
    if (!pack || !pack.purchases) return [];

    return pack.purchases
      .map((purchase) => ({
        edition: Number(purchase.editionNumber),
        price: Number(formatUnits(BigInt(purchase.price), 18)),
        status: "sold",
      }))
      .sort((a, b) => a.edition - b.edition);
  };

  const generateBuyerRevenueTable = () => {
    if (!pack || !pack.purchases || pack.purchases.length <= 1) return [];

    const REVENUE_SHARE_PERCENTAGE = 10;
    const buyers: {
      [key: string]: {
        address: string;
        shareWeight: number;
        totalRevenue: number;
        revenueFromPurchases: {
          purchaseId: string;
          amount: number;
          fromBuyer: string;
        }[];
      };
    } = {};

    pack.purchases.forEach((purchase, purchaseIndex) => {
      if (purchaseIndex === 0) return;

      const price = Number(formatUnits(BigInt(purchase.price), 18));
      const buyerSharePool = price * (REVENUE_SHARE_PERCENTAGE / 100);

      let totalShares = 0;
      for (let i = 0; i < purchaseIndex; i++) {
        const editionNumber = i + 1;
        const shareWeight = 100 / editionNumber;
        totalShares += shareWeight;
      }

      for (let i = 0; i < purchaseIndex; i++) {
        const prevPurchase = pack.purchases[i];
        const editionNumber = i + 1;
        const shareWeight = 100 / editionNumber;
        const buyerPayout = (buyerSharePool * shareWeight) / totalShares;

        if (!buyers[prevPurchase.buyer]) {
          buyers[prevPurchase.buyer] = {
            address: prevPurchase.buyer,
            shareWeight: shareWeight,
            totalRevenue: 0,
            revenueFromPurchases: [],
          };
        }

        buyers[prevPurchase.buyer].totalRevenue += buyerPayout;
        buyers[prevPurchase.buyer].revenueFromPurchases.push({
          purchaseId: purchase.purchaseId,
          amount: buyerPayout,
          fromBuyer: purchase.buyer,
        });
      }
    });

    return Object.values(buyers);
  };

  if (packLoading) {
    return (
      <div className="w-full flex flex-col relative items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper h-full flex">
              <div className="stamp-spots p-4 w-full h-full">
                <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
                  <div className="stamp-grid-background"></div>
                  <div className="text-center text-sm py-8">
                    {dict?.reactionPack?.loading}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="w-full flex flex-col relative items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper h-full flex">
              <div className="stamp-spots p-4 w-full h-full">
                <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
                  <div className="stamp-grid-background"></div>
                  <div className="text-center text-sm py-8">
                    {dict?.reactionPack?.notFound}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper h-full flex">
            <div className="stamp-spots p-4 w-full h-full">
              <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-5 justify-start">
                <div className="stamp-grid-background"></div>
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  <div className="flex flex-col lg:flex-row gap-4 w-full justify-between relative">
                    <div className="w-full lg:w-48 h-48 relative shrink-0">
                      <Image
                        fill
                        src={`${INFURA_GATEWAY}/ipfs/${
                          pack.packMetadata?.image?.split("ipfs://")?.[1]
                        }`}
                        alt={pack.packMetadata?.title}
                        objectFit="contain"
                        draggable={false}
                      />
                    </div>

                    <div className="flex flex-col w-full gap-2 items-start justify-start relative">
                      <div className="relative w-fit h-fit flex flex-col items-start justify-start text-left">
                        <h1 className="stamp-title text-lg mb-1">
                          {pack.packMetadata?.title}
                        </h1>
                        <div className="text-xs text-gray-600 font-aza">
                          {dict?.reactionPack?.packLabel} #{pack.packId}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 line-clamp-3 font-mid">
                        {pack.packMetadata?.description ||
                          dict?.reactionPack?.noDescription}
                      </p>

                      <div className="flex flex-row w-full flex-wrap gap-3 justify-between items-center relative w-full h-fit">
                        <div className="border border-gray-300 p-2 text-center bg-white/70">
                          <div className="text-sm font-brass">
                            {formatUnits(BigInt(pack.currentPrice), 18)} MONA
                          </div>
                          <div className="text-xs text-gray-600">
                            {dict?.reactionPack?.currentPrice}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-2 text-center bg-white/70">
                          <div className="text-sm font-brass">
                            {pack.soldCount}/{pack.maxEditions}
                          </div>
                          <div className="text-xs text-gray-600">
                            {dict?.reactionPack?.sold}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-2 text-center bg-white/70">
                          <div className="text-sm font-brass">
                            {pack.reactions?.length || 0}
                          </div>
                          <div className="text-xs text-gray-600">
                            {dict?.reactionPack?.reactions}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-2 text-center bg-white/70">
                          <div
                            className={`text-sm font-brass ${
                              pack.active === true
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {pack.active === true
                              ? dict?.reactionPack?.active
                              : dict?.reactionPack?.inactive}
                          </div>
                          <div className="text-xs text-gray-600">
                            {dict?.reactionPack?.status}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={
                          isInReservedPhase && !isConductor
                            ? undefined
                            : !hasAllowance
                            ? handleApprove
                            : handlePurchasePack
                        }
                        disabled={
                          purchaseLoading ||
                          approveLoading ||
                          pack.active !== true ||
                          (isInReservedPhase && !isConductor)
                        }
                        className="w-full py-2 px-4 text-xs bg-black disabled:bg-gray-400 text-white transition-all rounded"
                      >
                        {isInReservedPhase && !isConductor
                          ? dict?.reactionPack?.conductorReserved
                          : approveLoading
                          ? dict?.reactionPack?.approving
                          : purchaseLoading
                          ? dict?.reactionPack?.purchasing
                          : !hasAllowance
                          ? dict?.reactionPack?.approve
                          : dict?.reactionPack?.purchasePack}
                      </button>
                    </div>
                  </div>

                  <div className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit">
                    <div className="flex justify-between gap-3 flex-wrap items-center w-full">
                      <h2 className="stamp-title text-base">
                        {dict?.reactionPack?.designer}
                      </h2>
                      <button
                        onClick={() =>
                          router.push(
                            `/designer/${pack.designerProfile?.wallet}`
                          )
                        }
                        className="text-xxs text-gray-600 hover:text-black underline hover:no-underline transition-all font-brass"
                      >
                        {dict?.reactionPack?.viewDesignerProfile} →
                      </button>
                    </div>

                    <div className="flex items-start gap-3 w-full justify-start">
                      {pack.designerProfile?.metadata?.image && (
                        <div className="w-12 h-12 relative border border-black shrink-0">
                          <Image
                            fill
                            src={`${INFURA_GATEWAY}/ipfs/${
                              pack.designerProfile.metadata.image?.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                            alt={pack.designerProfile.metadata.title}
                            className="object-cover"
                            draggable={false}
                          />
                        </div>
                      )}
                      <div className="text-sm flex relative w-fit h-fit font-aza">
                        {pack.designerProfile?.metadata?.title ||
                          dict?.reactionPack?.unknownDesigner}
                      </div>
                    </div>
                  </div>

                  <div className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit">
                    <h2 className="stamp-title text-base">
                      {dict?.reactionPack?.priceProgression}
                    </h2>

                    {generatePriceChartData().length > 0 ? (
                      <div className="w-full space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                          {generatePriceChartData()
                            .slice(0, 10)
                            .map((data) => (
                              <div
                                key={data.edition}
                                className="border border-gray-300 p-2 text-center bg-white/70 hover:bg-white/90 transition-colors"
                              >
                            <div className="text-xs text-gray-600 font-aza">
                              {dict?.reactionPack?.edition} #{data.edition}
                            </div>
                                <div className="text-sm font-brass">
                                  {data.price.toFixed(4)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  MONA
                                </div>
                              </div>
                            ))}
                          {Number(pack.maxEditions) > 10 && (
                            <div className="border border-gray-300 p-2 text-center bg-white/70">
                              <div className="text-xs text-gray-600 font-aza">
                                {dict?.reactionPack?.ellipsis}
                              </div>
                              <div className="text-sm font-brass">
                                +{Number(pack.maxEditions) - 10}
                              </div>
                              <div className="text-xs text-gray-500">
                                {dict?.reactionPack?.more}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 text-xs">
                          <div className="flex-1 border border-gray-200 p-2 bg-white/50">
                            <span className="text-gray-600 font-aza">
                              {dict?.reactionPack?.basePrice}:{" "}
                            </span>
                            <span className="font-brass">
                              {formatUnits(BigInt(pack.basePrice), 18)} MONA
                            </span>
                          </div>
                          <div className="flex-1 border border-gray-200 p-2 bg-white/50">
                            <span className="text-gray-600 font-aza">
                              {dict?.reactionPack?.priceIncrement}:{" "}
                            </span>
                            <span className="font-brass">
                              {formatUnits(BigInt(pack.priceIncrement), 18)}{" "}
                              MONA
                            </span>
                          </div>
                          <div className="flex-1 border border-gray-200 p-2 bg-white/50">
                            <span className="text-gray-600 font-aza">
                              {dict?.reactionPack?.currentPrice}:{" "}
                            </span>
                            <span className="font-brass">
                              {formatUnits(BigInt(pack.currentPrice), 18)} MONA
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 font-mid italic">
                          {dict?.reactionPack?.basePriceFormula}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="text-xs text-gray-600 font-mid">
                          {dict?.reactionPack?.noPriceHistory}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 text-xs mt-3">
                          <div className="flex-1 border border-gray-200 p-2 bg-white/50">
                            <span className="text-gray-600 font-aza">
                              {dict?.reactionPack?.startingPrice}:{" "}
                            </span>
                            <span className="font-brass">
                              {formatUnits(BigInt(pack.basePrice), 18)} MONA
                            </span>
                          </div>
                          <div className="flex-1 border border-gray-200 p-2 bg-white/50">
                            <span className="text-gray-600 font-aza">
                              {dict?.reactionPack?.perEdition}:{" "}
                            </span>
                            <span className="font-brass">
                              +{formatUnits(BigInt(pack.priceIncrement), 18)}{" "}
                              MONA
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit">
                    <h2 className="stamp-title text-base">
                      {dict?.reactionPack?.reactions} (
                      {pack.reactions?.length || 0})
                    </h2>

                    {pack.reactions && pack.reactions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                        {pack.reactions.map((reaction, index) => (
                          <div
                            key={`${reaction.reactionId}-${index}`}
                            className="border border-gray-300 p-3 bg-white/70"
                          >
                            <div className="w-full h-24 relative mb-2">
                              <Image
                                fill
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  reaction.reactionMetadata?.image?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                alt={reaction.reactionMetadata?.title}
                                objectFit="contain"
                                draggable={false}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="text-xs font-aza line-clamp-1">
                                {reaction.reactionMetadata?.title ||
                                  dict?.reactionPack?.untitledReaction}
                              </div>

                              <div className="text-xs text-gray-600 line-clamp-2 font-mid">
                                {reaction.reactionMetadata?.description ||
                                  dict?.reactionPack?.noDescription}
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>
                                  <div className="text-gray-500 font-aza">
                                    {dict?.reactionPack?.model}:
                                  </div>
                                  <div className="line-clamp-1 font-mid">
                                    {reaction.reactionMetadata?.model ||
                                      dict?.reactionPack?.unknown}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500 font-aza">
                                    {dict?.reactionPack?.workflow}:
                                  </div>
                                  <div className="line-clamp-1 font-mid">
                                    {reaction.reactionMetadata?.workflow ||
                                      dict?.reactionPack?.unknown}
                                  </div>
                                </div>
                              </div>

                              {reaction.reactionMetadata?.prompt && (
                                <div className="text-xs">
                                  <div className="text-gray-500 font-aza">
                                    {dict?.reactionPack?.prompt}:
                                  </div>
                                  <div className="text-gray-600 line-clamp-2 font-mid italic">
                                    "{reaction.reactionMetadata.prompt}"
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-600 text-xs w-full">
                        {dict?.reactionPack?.noReactionsAvailable}
                      </div>
                    )}
                  </div>

                  {generateBuyerRevenueTable().length > 0 && (
                    <div className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit">
                      <div className="flex justify-between items-center w-full">
                        <h2 className="stamp-title text-base">
                          {dict?.reactionPack?.buyerRevenueDistribution}
                        </h2>
                        <button
                          onClick={() =>
                            setIsRevenueTableExpanded(!isRevenueTableExpanded)
                          }
                          className="text-xs text-gray-600 hover:text-black underline hover:no-underline transition-all font-brass"
                        >
                          {isRevenueTableExpanded
                            ? dict?.reactionPack?.collapse
                            : dict?.reactionPack?.expand}
                        </button>
                      </div>

                      <div className="text-xs text-gray-600 font-mid">
                        {dict?.reactionPack?.revenueExplanation}
                      </div>

                      <div
                        className={`space-y-2 transition-all duration-300 w-full ${
                          isRevenueTableExpanded
                            ? "max-h-96 overflow-y-auto"
                            : "max-h-32 overflow-hidden"
                        }`}
                      >
                        {generateBuyerRevenueTable().map((buyer) => (
                          <div
                            key={buyer.address}
                            className="border border-gray-200 p-3 space-y-2 bg-white/70"
                          >
                            <div className="flex justify-between items-start">
                              <div className="text-xs font-aza text-left flex flex-col justify-start items-start relative">
                                <div>{formatAddress(buyer.address)}</div>
                                <div className="text-gray-600">
                                  {dict?.reactionPack?.shareWeight}:{" "}
                                  {buyer.shareWeight.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-right text-xs font-aza">
                                <div className="font-brass">
                                  {buyer.totalRevenue.toFixed(6)} MONA
                                </div>
                                <div className="text-gray-600">
                                  {dict?.reactionPack?.totalReceived}
                                </div>
                              </div>
                            </div>

                            {buyer.revenueFromPurchases.length > 0 &&
                              isRevenueTableExpanded && (
                                <div className="space-y-1 pt-2 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 font-aza">
                                    {dict?.reactionPack?.revenueFromPurchases}:
                                  </div>
                                  {buyer.revenueFromPurchases.map(
                                    (revenue, idx) => (
                                      <div
                                        key={`${revenue.purchaseId}-${idx}`}
                                        className="flex justify-between text-xs text-gray-600 font-mid"
                                      >
                                        <span>
                                          {dict?.reactionPack?.from} #
                                          {revenue.purchaseId}
                                        </span>
                                        <span className="font-brass">
                                          {revenue.amount.toFixed(6)} MONA
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

                      {!isRevenueTableExpanded &&
                        generateBuyerRevenueTable().length > 2 && (
                          <div className="text-center pt-2 w-full">
                            <div className="text-xs text-gray-500 font-mid">
                              {generateBuyerRevenueTable().length - 2}{" "}
                              {dict?.reactionPack?.moreBuyers}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  <div className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit">
                    <h2 className="stamp-title text-base">
                      {dict?.reactionPack?.purchaseHistory}
                    </h2>

                    {pack.purchases && pack.purchases.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto w-full">
                        {pack.purchases.map((purchase, index) => (
                          <div
                            key={`${purchase.purchaseId}-${index}`}
                            className="border border-gray-200 p-3 bg-white/70 items-start justify-start"
                          >
                            <div className="flex justify-between gap-4 flex-row items-start mb-2 flex-wrap">
                              <div className="text-xs font-aza relative flex flex-col gap-1 text-left items-start justify-start">
                                <div>
                                  {dict?.reactionPack?.edition} #
                                  {purchase.editionNumber}
                                </div>
                                <div className="text-gray-600">
                                  {formatAddress(purchase.buyer)}
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
                                {dict?.reactionPack?.shareWeight}:{" "}
                                {purchase.shareWeight}
                              </div>
                              <div className="break-all">
                                {dict?.reactionPack?.tx}:
                                <button
                                  onClick={() =>
                                    window.open(
                                      getExplorerUrl(
                                        network,
                                        purchase.transactionHash
                                      )
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
                    ) : (
                      <div className="text-center py-4 text-gray-600 text-xs w-full">
                        {dict?.reactionPack?.noPurchasesYet}
                      </div>
                    )}
                  </div>

                  <div className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit">
                    <h2 className="stamp-title text-base">
                      {dict?.reactionPack?.packInfo}
                    </h2>

                    <div className="space-y-2 text-xs w-full">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.packId}:
                        </span>
                        <span className="font-aza">#{pack.packId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.currentPrice}:
                        </span>
                        <span className="font-brass">
                          {formatUnits(BigInt(pack.currentPrice), 18)} MONA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.basePrice}:
                        </span>
                        <span className="font-brass">
                          {formatUnits(BigInt(pack.basePrice), 18)} MONA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.priceIncrement}:
                        </span>
                        <span className="font-brass">
                          {formatUnits(BigInt(pack.priceIncrement), 18)} MONA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.editions}:
                        </span>
                        <span className="font-aza">
                          {pack.soldCount}/{pack.maxEditions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.conductorReserved}:
                        </span>
                        <span className="font-aza">
                          {pack.conductorReservedSpots}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-aza">
                          {dict?.reactionPack?.status}:
                        </span>
                        <span
                          className={`font-aza ${
                            pack.active === true
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {pack.active === true
                            ? dict?.reactionPack?.active
                            : dict?.reactionPack?.inactive}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionPackEntry;
