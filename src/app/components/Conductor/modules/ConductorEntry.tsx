"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import useConductor from "../hooks/useConductor";
import Image from "next/image";
import { getCurrentNetwork } from "@/app/lib/constants";
import { EMOJIS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";

const ConductorEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { conductor: conductorAddress } = useParams();
  const { 
    conductor, 
    conductorLoading,
    handleReview,
    reviewLoading,
    reviewSuccess,
    reviewData,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction
  } = useConductor(conductorAddress as string);
  const router = useRouter();
  const context = useContext(ModalContext);
  const network = getCurrentNetwork();

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

  if (conductorLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-blocks p-8">
        <div className="text-center">{dict?.conductor?.loading}</div>
      </div>
    );
  }

  if (!conductor) {
    return (
      <div className="w-full max-w-6xl mx-auto font-blocks p-8">
        <div className="text-center">{dict?.conductor?.notFound}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto font-blocks p-3 relative">
      {floatingEmojis.map((floatingEmoji) => (
        <div
          key={floatingEmoji.id}
          className="fixed pointer-events-none z-[60] float-animation"
          style={{ left: floatingEmoji.x, top: floatingEmoji.y }}
        >
          {floatingEmoji.emoji.startsWith("http") ? (
            <Image
              src={floatingEmoji.emoji}
              alt="reaction"
              width={20}
              height={20}
              className="object-cover"
            />
          ) : (
            <span className="text-base">{floatingEmoji.emoji}</span>
          )}
        </div>
      ))}
      
      <div className="border border-black p-3 mb-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {conductor.metadata?.image && (
            <div className="w-full lg:w-48 h-48 relative border border-black shrink-0 mx-auto lg:mx-0">
              <Image
                fill
                src={conductor.metadata.image}
                alt={conductor.metadata.title}
                className="object-cover"
                draggable={false}
              />
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-lg font-medium mb-1">
                {conductor.metadata?.title}
              </h1>
              <div className="text-sm text-gray-600">#{conductor.conductorId}</div>
            </div>
            
            {conductor.metadata?.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{conductor.metadata.description}</p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="border border-gray-300 p-2">
                <div className="font-medium text-sm">{conductor.appraisalCount}</div>
                <div className="text-gray-600">Appraisals</div>
              </div>
              <div className="border border-gray-300 p-2">
                <div className="font-medium text-sm">{conductor.averageScore}</div>
                <div className="text-gray-600">Avg Score</div>
              </div>
              <div className="border border-gray-300 p-2">
                <div className="font-medium text-sm">{conductor.reviewCount}</div>
                <div className="text-gray-600">Reviews</div>
              </div>
              <div className="border border-gray-300 p-2">
                <div className="font-medium text-sm">{conductor.inviteCount}</div>
                <div className="text-gray-600">Invites</div>
              </div>
            </div>
            
            <div className="text-xs">
              <div>Wallet: <span className="font-mono">{formatAddress(conductor.wallet)}</span></div>
              <div>Created: {formatDate(conductor.blockTimestamp)} | <a href={getExplorerUrl(conductor.transactionHash)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TX</a></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-black border-t-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 border-b border-black bg-gray-50">
          <div className="text-base font-medium">{dict?.conductor?.appraisals} ({conductor.appraisalCount})</div>
          <button
            onClick={() => setShowEmojiPanel(true)}
            className="px-3 py-1 text-sm bg-black text-white hover:bg-gray-800 w-fit"
          >
            {dict?.conductor?.reviewConductor}
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {conductor.appraisals && conductor.appraisals.length > 0 ? (
            conductor.appraisals.map((appraisal: any) => (
              <div key={appraisal.appraisalId} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-1 text-xs">#{appraisal.appraisalId}</span>
                    <span className="font-bold text-sm">{appraisal.overallScore}/100</span>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(appraisal.blockTimestamp)}</div>
                </div>
                
                <div className="text-xs text-gray-600 mb-2">
                  NFT: {formatAddress(appraisal.nftContract)} #{appraisal.nftId}
                </div>

                {appraisal.metadata?.comment && (
                  <div className="text-sm bg-gray-100 p-2 italic mb-2">"{appraisal.metadata.comment}"</div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {appraisal.metadata?.reactions?.map((reaction: any, idx: number) => (
                      <span key={idx}>{reaction.emoji}{reaction.count > 1 && reaction.count}</span>
                    ))}
                    {appraisal.reactions?.map((reaction: any, idx: number) => (
                      <span key={idx} className="bg-gray-200 px-1 rounded">R{reaction.reactionId}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <a href={getExplorerUrl(appraisal.transactionHash)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TX</a>
                    <button onClick={() => router.push(`/nft/${appraisal.nftContract}/${appraisal.nftId}`)} className="text-blue-600 hover:underline">{dict?.conductor?.viewNFT}</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-gray-600">{dict?.conductor?.noAppraisals}</div>
          )}
        </div>
      </div>

      <div className="border border-black border-t-0">
        <div className="p-3 border-b border-black bg-gray-50">
          <div className="text-base font-medium">{dict?.conductor?.reviewsReceived} ({conductor.reviewCount})</div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {conductor.reviews && conductor.reviews.length > 0 ? (
            conductor.reviews.map((review: any) => (
              <div key={review.reviewId} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-1 text-xs">#{review.reviewId}</span>
                    <span className="font-bold text-sm">{review.reviewScore}/100</span>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(review.timestamp)}</div>
                </div>
                
                <div className="text-xs text-gray-600 mb-2">
                  By: {review.reviewer?.metadata?.title || formatAddress(review.reviewer?.wallet)}
                </div>

                {review.metadata?.comment && (
                  <div className="text-sm bg-gray-100 p-2 italic mb-2">"{review.metadata.comment}"</div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {review.metadata?.reactions?.map((reaction: any, idx: number) => (
                      <span key={idx}>{reaction.emoji}{reaction.count > 1 && reaction.count}</span>
                    ))}
                    {review.reactions?.map((reaction: any, idx: number) => (
                      <span key={idx} className="bg-gray-200 px-1 rounded">R{reaction.reactionId}</span>
                    ))}
                  </div>
                  <button onClick={() => router.push(`/reviewer/${review.reviewer?.wallet}`)} className="text-xs text-blue-600 hover:underline">{dict?.conductor?.viewReviewerProfile}</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-gray-600">{dict?.conductor?.noReviews}</div>
          )}
        </div>
      </div>

      <div className="border border-black border-t-0">
        <div className="p-3 border-b border-black bg-gray-50">
          <div className="text-base font-medium">{dict?.conductor?.invitedDesigners} ({conductor.invitedDesigners?.length || 0})</div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {conductor.invitedDesigners && conductor.invitedDesigners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
              {conductor.invitedDesigners.map((designer: any, idx: number) => (
                <div key={idx} className="border border-gray-300 p-2">
                  {designer.metadata?.image && (
                    <div className="w-full h-20 relative mb-2 border border-gray-300">
                      <Image
                        fill
                        src={designer.metadata.image}
                        alt={designer.metadata.title}
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium line-clamp-1">
                      {designer.metadata?.title || dict?.conductor?.unnamedDesigner}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {formatAddress(designer.wallet)}
                    </div>
                    <button
                      onClick={() => router.push(`/designer/${designer.wallet}`)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {dict?.conductor?.viewDesignerProfile}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-600">{dict?.conductor?.noInvitedDesigners}</div>
          )}
        </div>
      </div>

      {showEmojiPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white border border-black p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium">{dict?.conductor?.reviewConductor}</h3>
              <button onClick={() => setShowEmojiPanel(false)} className="text-xl hover:bg-gray-100 w-7 h-7 flex items-center justify-center">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium">{dict?.conductor?.comment}</label>
                <textarea
                  value={reviewData?.comment}
                  onChange={(e) => updateComment(e.target.value)}
                  className="w-full p-2 border border-black focus:outline-none text-sm"
                  rows={3}
                  style={{ resize: "none" }}
                  placeholder={dict?.conductor?.commentPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">{dict?.conductor?.reviewScore}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reviewData?.reviewScore}
                    onChange={(e) => updateScore(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 border border-black appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium w-10 text-center">{reviewData?.reviewScore}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">REACTIONS</label>
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
                    <div className="text-sm mb-2 font-medium">{dict?.conductor?.customReactions}</div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {context.userReactions.map((item: { reaction: any; count: number }) => {
                        const currentUsage = reviewData?.reactionUsage?.find((r) => r.reactionId === Number(item.reaction.reactionId));
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
                              <Image src={item.reaction.reactionMetadata.image} alt={item.reaction.reactionMetadata.title} fill className="object-cover" />
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

              {((reviewData?.reactions?.length || 0) > 0 || (reviewData?.reactionUsage?.length || 0) > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {(reviewData?.reactions || []).map((reaction) => (
                    <div key={reaction.emoji} className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-sm">
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                      <button onClick={() => decreaseEmoji(reaction.emoji)} className="text-sm hover:bg-gray-200 px-1" title={dict?.conductor?.removeOne}>×</button>
                    </div>
                  ))}
                  {(reviewData?.reactionUsage || []).map((usage) => {
                    const reaction = context?.userReactions?.find((r) => r.reaction.reactionId === usage.reactionId.toString())?.reaction;
                    if (!reaction) return null;
                    return (
                      <div key={`reaction_${usage.reactionId}`} className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-sm">
                        <Image src={reaction.reactionMetadata.image} alt={reaction.reactionMetadata.title} width={12} height={12} className="object-cover" />
                        <span>{usage.count}</span>
                        <button onClick={() => decreaseCustomReaction(usage.reactionId.toString())} className="text-sm hover:bg-gray-200 px-1" title={dict?.conductor?.removeOne}>×</button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleReview}
                disabled={!reviewData?.comment || (reviewData?.reactions?.length || 0) === 0 || reviewLoading || reviewSuccess}
                className={`w-full py-2 px-4 border text-sm disabled:opacity-50 ${reviewSuccess ? "border-green-500 bg-green-500 text-white" : "border-black text-black hover:bg-black hover:text-white"}`}
              >
                {reviewSuccess ? dict?.conductor?.reviewSubmitted : reviewLoading ? dict?.conductor?.submitting : dict?.conductor?.submitReview}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConductorEntry;
