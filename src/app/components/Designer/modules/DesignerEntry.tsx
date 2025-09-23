"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX } from "react";
import useDesigner from "../hooks/useDesigner";
import Image from "next/image";
import { formatUnits } from "viem";

const DesignerEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { designer: designerAddress } = useParams();
  const { designer, designerLoading } = useDesigner(designerAddress as string);
  const router = useRouter();

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

  if (designerLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-blocks p-8">
        <div className="text-center">{dict?.designer?.loading}</div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="w-full max-w-6xl mx-auto font-blocks p-8">
        <div className="text-center">{dict?.designer?.notFound}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto font-blocks p-3">
      <div className="border border-black p-3 mb-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {designer.metadata?.image && (
            <div className="w-full lg:w-48 h-48 relative border border-black shrink-0 mx-auto lg:mx-0">
              <Image
                fill
                src={designer.metadata.image}
                alt={designer.metadata.title}
                className="object-cover"
                draggable={false}
              />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-lg font-medium mb-1">{designer.metadata?.title}</h1>
              <div className="text-sm text-gray-600">#{designer.designerId}</div>
            </div>

            {designer.metadata?.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{designer.metadata.description}</p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              <div className="border border-gray-300 p-2">
                <div className="font-medium text-sm">{designer.packCount}</div>
                <div className="text-gray-600">Packs</div>
              </div>
              <div className="border border-gray-300 p-2">
                <div className={`font-medium text-sm ${designer.active === "true" ? "text-green-600" : "text-red-600"}`}>
                  {designer.active === "true" ? "✓" : "✗"}
                </div>
                <div className="text-gray-600">Status</div>
              </div>
              <div className="border border-gray-300 p-2 col-span-2 lg:col-span-1">
                <div className="font-medium text-sm">{formatDate(designer.inviteTimestamp)}</div>
                <div className="text-gray-600">Invited</div>
              </div>
            </div>

            <div className="text-xs">
              <div>Wallet: <span className="font-mono">{formatAddress(designer.wallet)}</span></div>
              <div>Invited by: <span className="font-mono">{formatAddress(designer.invitedBy)}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-black border-t-0">
        <div className="p-3 border-b border-black bg-gray-50">
          <div className="text-base font-medium">{dict?.designer?.reactionPacksCreated} ({designer.reactionPacks?.length || 0})</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {designer.reactionPacks && designer.reactionPacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-3">
              {designer.reactionPacks.map((pack, index) => (
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
                    <h3 className="text-sm font-medium line-clamp-1">{pack.packMetadata?.title}</h3>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">{pack.packMetadata?.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="font-medium">{formatUnits(BigInt(pack.currentPrice), 18)} MONA</div>
                        <div className="text-gray-600">Price</div>
                      </div>
                      <div>
                        <div className="font-medium">{pack.soldCount}/{pack.maxEditions}</div>
                        <div className="text-gray-600">Sold</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div className={pack.active === "true" ? "text-green-600" : "text-red-600"}>
                        #{pack.packId} {pack.active === "true" ? "✓" : "✗"}
                      </div>
                      <div className="text-gray-600">
                        {pack.reactions?.length || 0} reactions
                      </div>
                    </div>

                    {pack.reactions && pack.reactions.length > 0 && (
                      <div className="flex gap-1">
                        {pack.reactions.slice(0, 6).map((reaction, idx) => (
                          <div key={`${reaction.reactionId}-${idx}`} className="w-4 h-4 relative border border-gray-200">
                            <Image
                              fill
                              src={reaction.reactionMetadata?.image}
                              alt={reaction.reactionMetadata?.title}
                              className="object-cover"
                              draggable={false}
                            />
                          </div>
                        ))}
                        {pack.reactions.length > 6 && (
                          <div className="w-4 h-4 border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">+</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-600">{dict?.designer?.noReactionPacks}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignerEntry;
