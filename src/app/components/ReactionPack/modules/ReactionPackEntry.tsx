"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useState } from "react";
import usePack from "../hooks/usePack";
import Image from "next/image";
import { formatUnits } from "viem";
import { getCurrentNetwork } from "@/app/lib/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReactionPackEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { pack: packId } = useParams();
  const { pack, packLoading, handlePurchasePack, purchaseLoading } = usePack(
    Number(packId)
  );
  const router = useRouter();
  const network = getCurrentNetwork();
  const [isRevenueTableExpanded, setIsRevenueTableExpanded] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExplorerUrl = (txHash: string) => {
    return `${network.blockExplorer}/tx/${txHash}`;
  };

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
      <div className="w-full max-w-6xl mx-auto font-blocks p-8">
        <div className="text-center">{dict?.reactionPack?.loading}</div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="w-full max-w-6xl mx-auto font-blocks p-8">
        <div className="text-center">{dict?.reactionPack?.notFound}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto font-blocks p-3">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        <div className="xl:col-span-3 space-y-3">
          <div className="border border-black p-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="w-full lg:w-48 h-48 relative border border-black shrink-0">
                <Image
                  fill
                  src={pack.packMetadata?.image}
                  alt={pack.packMetadata?.title}
                  className="object-cover"
                  draggable={false}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-lg font-medium mb-1">{pack.packMetadata?.title}</h1>
                  <div className="text-sm text-gray-600">Pack #{pack.packId}</div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {pack.packMetadata?.description || dict?.reactionPack?.noDescription}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="border border-gray-300 p-2">
                    <div className="font-medium text-sm">{formatUnits(BigInt(pack.currentPrice), 18)} MONA</div>
                    <div className="text-gray-600">Current Price</div>
                  </div>
                  <div className="border border-gray-300 p-2">
                    <div className="font-medium text-sm">{pack.soldCount}/{pack.maxEditions}</div>
                    <div className="text-gray-600">Sold</div>
                  </div>
                  <div className="border border-gray-300 p-2">
                    <div className="font-medium text-sm">{pack.reactions?.length || 0}</div>
                    <div className="text-gray-600">Reactions</div>
                  </div>
                  <div className="border border-gray-300 p-2">
                    <div className={`font-medium text-sm ${pack.active === "true" ? "text-green-600" : "text-red-600"}`}>
                      {pack.active === "true" ? "✓" : "✗"}
                    </div>
                    <div className="text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black border-t-0">
            <div className="p-3 border-b border-black bg-gray-50">
              <div className="text-base font-medium">{dict?.reactionPack?.priceProgression}</div>
            </div>
            
            <div className="p-3">
              <div className="h-32 w-full bg-white border border-gray-300">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generatePriceChartData()}>
                    <CartesianGrid strokeDasharray="1 1" stroke="#d1d5db" />
                    <XAxis
                      dataKey="edition"
                      axisLine={{ stroke: "#000000", strokeWidth: 1 }}
                      tickLine={{ stroke: "#000000", strokeWidth: 1 }}
                      tick={{ fontSize: 9, fill: "#000000" }}
                    />
                    <YAxis
                      axisLine={{ stroke: "#000000", strokeWidth: 1 }}
                      tickLine={{ stroke: "#000000", strokeWidth: 1 }}
                      tick={{ fontSize: 9, fill: "#000000" }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(4)} MONA`]}
                      labelFormatter={(label) => `Edition #${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #000000",
                        borderRadius: "0px",
                        fontSize: "9px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#000000"
                      strokeWidth={1}
                      dot={{ fill: "#000000", r: 1 }}
                      activeDot={{ r: 2, fill: "#000000" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-600 mt-2">{dict?.reactionPack?.basePriceFormula}</div>
            </div>
          </div>

          <div className="border border-black border-t-0">
            <div className="p-3 border-b border-black bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-base font-medium">{dict?.reactionPack?.buyerRevenueDistribution}</div>
                {generateBuyerRevenueTable().length > 0 && (
                  <button
                    onClick={() =>
                      setIsRevenueTableExpanded(!isRevenueTableExpanded)
                    }
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    {isRevenueTableExpanded ? dict?.reactionPack?.collapse : dict?.reactionPack?.expand}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3">
              {generateBuyerRevenueTable().length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs text-gray-600">
                    {dict?.reactionPack?.revenueExplanation}
                  </div>

                  <div
                    className={`space-y-2 transition-all duration-300 ${
                      isRevenueTableExpanded
                        ? "max-h-96 overflow-y-auto"
                        : "max-h-32 overflow-hidden"
                    }`}
                  >
                    {generateBuyerRevenueTable().map((buyer) => (
                      <div
                        key={buyer.address}
                        className="border border-gray-200 p-3 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-xs">
                            <div className="font-medium">
                              {formatAddress(buyer.address)}
                            </div>
                            <div className="text-gray-600">
                              {dict?.reactionPack?.shareWeight}: {buyer.shareWeight.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="font-medium">
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
                              <div className="text-xs text-gray-500">
                                {dict?.reactionPack?.revenueFromPurchases}:
                              </div>
                              {buyer.revenueFromPurchases.map(
                                (revenue, idx) => (
                                  <div
                                    key={`${revenue.purchaseId}-${idx}`}
                                    className="flex justify-between text-xs text-gray-600"
                                  >
                                    <span>{dict?.reactionPack?.from} #{revenue.purchaseId}</span>
                                    <span>
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
                      <div className="text-center pt-2">
                        <div className="text-xs text-gray-500">
                          {generateBuyerRevenueTable().length - 2} {dict?.reactionPack?.moreBuyers}
                          <button
                            onClick={() => setIsRevenueTableExpanded(true)}
                            className="text-blue-600 hover:text-blue-800 underline ml-1"
                          >
                            {dict?.reactionPack?.viewAll}
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-500 text-xs">
                  {dict?.reactionPack?.noRevenueYet}
                </div>
              )}
            </div>
          </div>

          <div className="border border-black border-t-0">
            <div className="p-3 border-b border-black bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-base font-medium">{dict?.reactionPack?.designer}</div>
                <button
                  onClick={() =>
                    router.push(`/designer/${pack.designerProfile?.wallet}`)
                  }
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {dict?.reactionPack?.viewDesignerProfile}
                </button>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-3">
                {pack.designerProfile?.metadata?.image && (
                  <div className="w-12 h-12 relative border border-black shrink-0">
                    <Image
                      fill
                      src={pack.designerProfile.metadata.image}
                      alt={pack.designerProfile.metadata.title}
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {pack.designerProfile?.metadata?.title || dict?.reactionPack?.unknownDesigner}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {pack.designerProfile?.metadata?.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {pack.designerProfile?.packCount} {dict?.reactionPack?.packsCreated}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black border-t-0">
            <div className="p-3 border-b border-black bg-gray-50">
              <div className="text-base font-medium">
                {dict?.reactionPack?.reactions} ({pack.reactions?.length || 0})
              </div>
            </div>

            <div className="p-3">
              {pack.reactions && pack.reactions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pack.reactions.map((reaction, index) => (
                    <div
                      key={`${reaction.reactionId}-${index}`}
                      className="border border-gray-300 p-2"
                    >
                      <div className="w-full h-24 relative border border-gray-200 mb-2">
                        <Image
                          fill
                          src={reaction.reactionMetadata?.image}
                          alt={reaction.reactionMetadata?.title}
                          className="object-cover"
                          draggable={false}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="font-medium text-xs line-clamp-1">
                          {reaction.reactionMetadata?.title ||
                            dict?.reactionPack?.untitledReaction}
                        </div>

                        <div className="text-xs text-gray-600 line-clamp-2">
                          {reaction.reactionMetadata?.description ||
                            dict?.reactionPack?.noDescription}
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>
                            <div className="text-gray-500">{dict?.reactionPack?.model}:</div>
                            <div className="line-clamp-1">
                              {reaction.reactionMetadata?.model || dict?.reactionPack?.unknown}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">{dict?.reactionPack?.workflow}:</div>
                            <div className="line-clamp-1">
                              {reaction.reactionMetadata?.workflow || dict?.reactionPack?.unknown}
                            </div>
                          </div>
                        </div>

                        {reaction.reactionMetadata?.prompt && (
                          <div className="text-xs">
                            <div className="text-gray-500">{dict?.reactionPack?.prompt}:</div>
                            <div className="italic text-gray-600 line-clamp-2">
                              "{reaction.reactionMetadata.prompt}"
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          {dict?.reactionPack?.tokenIds}: {reaction.tokenIds?.join(", ") || dict?.reactionPack?.none}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600 text-xs">
                  {dict?.reactionPack?.noReactionsAvailable}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border border-black p-3">
            <div className="text-base font-medium mb-3">{dict?.reactionPack?.packInfo}</div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.packId}:</span>
                <span className="font-medium">#{pack.packId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.currentPrice}:</span>
                <span className="font-medium">{formatUnits(BigInt(pack.currentPrice), 18)} MONA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.basePrice}:</span>
                <span className="font-medium">{formatUnits(BigInt(pack.basePrice), 18)} MONA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.priceIncrement}:</span>
                <span className="font-medium">{formatUnits(BigInt(pack.priceIncrement), 18)} MONA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.editions}:</span>
                <span className="font-medium">
                  {pack.soldCount}/{pack.maxEditions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.conductorReserved}:</span>
                <span className="font-medium">{pack.conductorReservedSpots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{dict?.reactionPack?.status}:</span>
                <span
                  className={
                    pack.active === "true" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                  }
                >
                  {pack.active === "true" ? dict?.reactionPack?.active : dict?.reactionPack?.inactive}
                </span>
              </div>
            </div>

            <button
              onClick={handlePurchasePack}
              disabled={purchaseLoading || pack.active !== "true"}
              className="w-full py-2 px-3 mt-3 bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {purchaseLoading ? dict?.reactionPack?.purchasing : dict?.reactionPack?.purchasePack}
            </button>
          </div>

          <div className="border border-black p-3">
            <div className="text-base font-medium mb-3">{dict?.reactionPack?.purchaseHistory}</div>

            {pack.purchases && pack.purchases.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pack.purchases.map((purchase, index) => (
                  <div
                    key={`${purchase.purchaseId}-${index}`}
                    className="border border-gray-200 p-2"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs">
                        <div className="font-medium">
                          {dict?.reactionPack?.edition} #{purchase.editionNumber}
                        </div>
                        <div className="text-gray-600">
                          {formatAddress(purchase.buyer)}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-medium">
                          {formatUnits(BigInt(purchase.price), 18)} MONA
                        </div>
                        <div className="text-gray-600">
                          {formatDate(purchase.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{dict?.reactionPack?.shareWeight}: {purchase.shareWeight}</div>
                      <div className="break-all">
                        {dict?.reactionPack?.tx}:
                        <button
                          onClick={() =>
                            window.open(
                              getExplorerUrl(purchase.transactionHash)
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 underline ml-1"
                        >
                          {formatAddress(purchase.transactionHash)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-600 text-xs">
                {dict?.reactionPack?.noPurchasesYet}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionPackEntry;
