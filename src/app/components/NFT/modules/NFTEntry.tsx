"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import useNFT from "../hooks/useNFT";
import useAppraise from "../hooks/useAppraise";
import Image from "next/image";
import { getCurrentNetwork } from "@/app/lib/constants";
import { EMOJIS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";

const NFTEntry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { nftContract, nftId } = useParams();
  const { nft, nftLoading } = useNFT(nftContract as string, Number(nftId));
  const router = useRouter();
  const context = useContext(ModalContext);
  const network = getCurrentNetwork();
  
  const {
    appraisalData,
    appraisalLoading,
    appraisalSuccess,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
    handleAppraisal
  } = useAppraise(nftContract as string, Number(nftId));

  const getExplorerUrl = (txHash: string) => {
    return `${network.blockExplorer}/tx/${txHash}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (nftLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="text-center text-sm">{dict?.nft?.loading}</div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="text-center text-sm">{dict?.nft?.notFound}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 relative">
      {floatingEmojis.map((floatingEmoji) => (
        <div
          key={floatingEmoji.id}
          className="fixed pointer-events-none z-[60] float-animation"
          style={{ 
            left: floatingEmoji.x, 
            top: floatingEmoji.y
          }}
        >
          {floatingEmoji.emoji.startsWith("http") ? (
            <Image
              src={floatingEmoji.emoji}
              alt="reaction"
              draggable={false}
              width={20}
              height={20}
              className="object-cover"
            />
          ) : (
            <span className="text-base">{floatingEmoji.emoji}</span>
          )}
        </div>
      ))}
      
      <div className="border border-black p-3">
        <div className="flex flex-col md:flex-row gap-3">
          {nft.metadata?.image && (
            <div className="w-full md:w-40 h-40 relative border border-black shrink-0 mx-auto md:mx-0">
              <Image
                fill
                src={nft.metadata.image}
                alt={nft.metadata?.title}
                className="object-contain"
                draggable={false}
              />
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <h1 className="text-base">
                  {nft.metadata?.title}
                </h1>
                <div className="text-sm text-gray-600">#{nft.nftId}</div>
              </div>
              <div className="text-left sm:text-right text-sm">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <div><span >{nft.appraisalCount}</span> appraisals</div>
                  <div><span >{nft.averageScore}</span> avg</div>
                  <div><span >{nft.totalScore}</span> total</div>
                </div>
              </div>
            </div>
            
            {nft.metadata?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{nft.metadata.description}</p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm">
              <div>Token: <span >{nft.tokenId}</span></div>
              <div>Type: <span>{nft.tokenType}</span></div>
              <div>Status: <span className={nft.active === "true" ? "text-green-600" : "text-red-600"}>{nft.active === "true" ? "✓" : "✗"}</span></div>
            </div>
            <div className="text-sm">Contract: <span >{formatAddress(nft.nftContract)}</span></div>
          </div>
        </div>
      </div>

      <div className="border border-black border-t-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 border-b border-black bg-gray-50">
          <div className="text-base">{dict?.nft?.appraisals} ({nft.appraisalCount})</div>
          {context?.conductor && (
            <button
              onClick={() => setShowEmojiPanel(true)}
              className="px-3 py-1 text-sm bg-black text-white hover:bg-gray-800 w-fit"
            >
              + {dict?.nft?.appraise}
            </button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {nft.appraisals && nft.appraisals.length > 0 ? (
            nft.appraisals.map((appraisal) => (
              <div key={appraisal.appraisalId} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-1 text-sm">#{appraisal.appraisalId}</span>
                    <span className="text-base">{appraisal.overallScore}</span>
                    <span className="text-sm text-gray-500">/ 100</span>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(appraisal.blockTimestamp)}</div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {appraisal.conductor?.metadata?.title}
                </div>

                {appraisal.metadata?.comment && (
                  <div className="text-sm bg-gray-100 p-2 italic mb-2">"{appraisal.metadata.comment}"</div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex flex-wrap gap-2 text-sm">
                    {appraisal.metadata?.reactions?.map((reaction, idx) => (
                      <span key={idx}>{reaction.emoji}{Number(reaction.count) > 1 && reaction.count}</span>
                    ))}
                    {appraisal.reactions?.map((reaction, idx) => (
                      <span key={idx} className="bg-gray-200 px-2 py-1 rounded">R{reaction.reactionId}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 text-sm">
                    <a href={getExplorerUrl(appraisal.transactionHash)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TX</a>
                    <button onClick={() => router.push(`/conductor/${appraisal.conductor?.conductorId}`)} className="text-blue-600 hover:underline">Profile</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-gray-600">{dict?.nft?.noAppraisals}</div>
          )}
        </div>
      </div>

      {showEmojiPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white border border-black p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base">{dict?.nft?.appraiseNft}</h3>
              <button onClick={() => setShowEmojiPanel(false)} className="text-xl hover:bg-gray-100 w-7 h-7 flex items-center justify-center">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">{dict?.nft?.comment}</label>
                <textarea
                  value={appraisalData?.comment}
                  onChange={(e) => updateComment(e.target.value)}
                  className="w-full p-2 border border-black focus:outline-none text-sm"
                  rows={3}
                  style={{ resize: "none" }}
                  placeholder={dict?.nft?.addComment}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">{dict?.nft?.overallScore}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appraisalData?.overallScore}
                    onChange={(e) => updateScore(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 border border-black appearance-none cursor-pointer"
                  />
                  <span className="text-sm w-10 text-center">{appraisalData?.overallScore}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">REACTIONS</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={(e) => handleEmojiButtonClick(emoji, e)}
                      className="p-2 text-base border border-gray-300 hover:border-black h-8 w-8 flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {context?.userReactions && context.userReactions.length > 0 && (
                  <div className="border-t border-gray-300 pt-3">
                    <div className="text-sm mb-2">{dict?.nft?.customReactions}</div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {context.userReactions.map((item: { reaction: any; count: number }) => {
                        const currentUsage = appraisalData?.reactionUsage?.find((r) => r.reactionId === Number(item.reaction.reactionId));
                        const currentCount = currentUsage ? currentUsage.count : 0;
                        const isDisabled = currentCount >= item.count;

                        return (
                          <button
                            key={item.reaction.reactionId}
                            onClick={(e) => {
                              if (isDisabled) return;
                              const rect = e.currentTarget.getBoundingClientRect();
                              handleCustomReactionClick(
                                item.reaction.reactionId,
                                item.reaction.reactionMetadata.image,
                                rect.left + rect.width / 2,
                                rect.top + rect.height / 2,
                                item.count
                              );
                            }}
                            disabled={isDisabled}
                            className={`relative border border-gray-300 hover:border-black p-1 ${isDisabled ? "opacity-50" : ""}`}
                            title={`${item.reaction.reactionMetadata.title} (${currentCount}/${item.count})`}
                          >
                            <div className="w-5 h-5 relative">
                              <Image src={item.reaction.reactionMetadata.image} alt={item.reaction.reactionMetadata.title} draggable={false} fill className="object-cover" />
                            </div>
                            {item.count > 1 && (
                              <span className="absolute -top-1 -right-1 bg-black text-white text-xs px-1">{item.count}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {((appraisalData?.reactions?.length || 0) > 0 || (appraisalData?.reactionUsage?.length || 0) > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {(appraisalData?.reactions || []).map((reaction) => (
                    <div key={reaction.emoji} className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-sm">
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                      <button onClick={() => decreaseEmoji(reaction.emoji)} className="text-sm hover:bg-gray-200 px-1" title={dict?.nft?.removeOne}>×</button>
                    </div>
                  ))}
                  {(appraisalData?.reactionUsage || []).map((usage) => {
                    const reaction = context?.userReactions?.find((r) => r.reaction.reactionId === usage.reactionId.toString())?.reaction;
                    if (!reaction) return null;
                    return (
                      <div key={`reaction_${usage.reactionId}`} className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-sm">
                        <Image src={reaction.reactionMetadata.image} alt={reaction.reactionMetadata.title} width={12} height={12} draggable={false} className="object-cover" />
                        <span>{usage.count}</span>
                        <button onClick={() => decreaseCustomReaction(usage.reactionId.toString())} className="text-sm hover:bg-gray-200 px-1" title={dict?.nft?.removeOne}>×</button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleAppraisal}
                disabled={!appraisalData?.comment || (appraisalData?.reactions?.length || 0) === 0 || appraisalLoading || appraisalSuccess}
                className={`w-full py-2 px-4 border text-sm disabled:opacity-50 ${appraisalSuccess ? "border-green-500 bg-green-500 text-white" : "border-black text-black hover:bg-black hover:text-white"}`}
              >
                {appraisalSuccess ? dict?.nft?.appraisalSubmitted : appraisalLoading ? dict?.nft?.submitting : dict?.nft?.submitAppraisal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTEntry;
