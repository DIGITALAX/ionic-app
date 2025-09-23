"use client";

import { FunctionComponent, JSX, useContext } from "react";
import useEntry from "../hooks/useEntry";
import { EMOJIS } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import Metadata from "./Metadata";
import { ModalContext } from "@/app/providers";
import Image from "next/image";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const {
    nftsLoading,
    currentNFT,
    nextNFT,
    previousNFT,
    handleAppraisal,
    appraisalLoading,
    appraisalSuccess,
    appraisalData,
    currentAppraisal,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
    handleAppraisalBatch,
  } = useEntry();

  const router = useRouter();
  const context = useContext(ModalContext);

  if (!currentNFT) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          {nftsLoading ? dict?.entry?.loading : dict?.entry?.noNfts}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative font-blocks">
      {appraisalData.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 z-50">
          <div className="text-sm">{dict?.entry?.pending}: {appraisalData.length}/10</div>
          {appraisalData.length >= 10 && (
            <button
              onClick={handleAppraisalBatch}
              disabled={appraisalLoading || appraisalSuccess}
              className={`mt-2 w-full py-1 px-2 border transition-colors text-xs ${
                appraisalSuccess
                  ? "border-green-400 bg-green-400 text-black"
                  : "border-white hover:bg-white hover:text-black"
              }`}
            >
              {appraisalSuccess
                ? dict?.entry?.allSubmitted
                : appraisalLoading 
                ? dict?.entry?.submitting
                : dict?.entry?.submitAll}
            </button>
          )}
        </div>
      )}
      {floatingEmojis.map((floatingEmoji) => (
        <div
          key={floatingEmoji.id}
          className="fixed pointer-events-none z-[60] animate-pulse"
          style={{
            left: floatingEmoji.x,
            top: floatingEmoji.y,
          }}
        >
          {floatingEmoji.emoji.startsWith("http") ? (
            <Image
              src={floatingEmoji.emoji}
              draggable={false}
              alt="reaction"
              width={24}
              height={24}
              className="object-cover"
            />
          ) : (
            <span className="text-lg">{floatingEmoji.emoji}</span>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousNFT}
          className="w-8 h-8 border border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center text-sm"
          disabled={nftsLoading}
        >
          ←
        </button>

        <div className="flex-1 mx-4">
          <div className="bg-white">
            <div className="text-center space-y-4">
              {currentNFT.metadata?.title && (
                <h2 className="text-xl font-medium">
                  {currentNFT.metadata.title}
                </h2>
              )}
              <div className="relative">
                <div
                  className="w-48 h-48 mx-auto relative border border-black cursor-pointer"
                  onClick={() => {
                    if (currentNFT) {
                      router.push(
                        `/nft/${currentNFT.nftContract}/${currentNFT.nftId}`
                      );
                    }
                  }}
                >
                  <Metadata metadata={currentNFT?.metadata!} />
                </div>

                <button
                  onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border border-black w-fit px-1 h-6 text-xs flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                >
                  + REACT
                </button>

                {showEmojiPanel && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-black p-3 z-20 w-64">
                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={(e) => {
                            handleEmojiButtonClick(emoji, e);
                            setShowEmojiPanel(false);
                          }}
                          className="p-1 text-lg border border-gray-300 hover:border-black transition-colors h-8 w-8 flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {context?.userReactions &&
                      context.userReactions.length > 0 && (
                        <div className="border-t border-gray-300 pt-2">
                          <div className="text-xs mb-2 font-medium">
                            {dict?.entry?.customReactions}
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                            {context.userReactions.map(
                              (item: { reaction: any; count: number }) => {
                                const currentUsage =
                                  currentAppraisal?.reactionUsage?.find(
                                    (r) =>
                                      r.reactionId ===
                                      Number(item.reaction.reactionId)
                                  );
                                const currentCount = currentUsage
                                  ? currentUsage.count
                                  : 0;
                                const isDisabled = currentCount >= item.count;

                                return (
                                  <button
                                    key={item.reaction.reactionId}
                                    onClick={(e) => {
                                      if (isDisabled) return;
                                      const rect = (
                                        e.target as HTMLElement
                                      ).getBoundingClientRect();
                                      handleCustomReactionClick(
                                        item.reaction.reactionId,
                                        item.reaction.reactionMetadata.image ||
                                          item.reaction.reactionMetadata.title,
                                        rect.left + rect.width / 2,
                                        rect.top + rect.height / 2,
                                        item.count
                                      );
                                      setShowEmojiPanel(false);
                                    }}
                                    disabled={isDisabled}
                                    className={`relative border border-gray-300 hover:border-black transition-colors p-1 ${
                                      isDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    title={`${item.reaction.reactionMetadata.title} (${currentCount}/${item.count})`}
                                  >
                                    <div className="w-6 h-6 relative">
                                      <Image
                                        src={
                                          item.reaction.reactionMetadata.image
                                        }
                                        alt={
                                          item.reaction.reactionMetadata.title
                                        }
                                        draggable={false}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    {item.count > 1 && (
                                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs px-1">
                                        {item.count}
                                      </span>
                                    )}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {currentNFT.metadata?.description && (
                  <div className="text-center mb-2 italic">
                    {currentNFT.metadata.description}
                  </div>
                )}
              </div>
              {((currentAppraisal?.reactions?.length || 0) > 0 ||
                (currentAppraisal?.reactionUsage?.length || 0) > 0) && (
                <div className="flex gap-1 flex-wrap justify-center">
                  {(currentAppraisal?.reactions || []).map((reaction) => (
                    <div
                      key={reaction.emoji}
                      className="flex items-center gap-1 bg-white border border-black px-1 py-0.5 text-xs"
                    >
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                      <button
                        onClick={() => decreaseEmoji(reaction.emoji)}
                        className="text-xs hover:bg-gray-200 px-0.5"
                        title={dict?.entry?.removeOne}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {(currentAppraisal?.reactionUsage || []).map((usage) => {
                    const reaction = context?.userReactions?.find(
                      (r) =>
                        r.reaction.reactionId === usage.reactionId.toString()
                    )?.reaction;
                    if (!reaction) return null;

                    return (
                      <div
                        key={`reaction_${usage.reactionId}`}
                        className="flex items-center gap-1 bg-white border border-black px-1 py-0.5 text-xs"
                      >
                        <Image
                          src={reaction.reactionMetadata.image}
                          alt={reaction.reactionMetadata.title}
                          width={12}
                          height={12}
                          draggable={false}
                          className="object-cover"
                        />
                        <span>{usage.count}</span>
                        <button
                          onClick={() =>
                            decreaseCustomReaction(usage.reactionId.toString())
                          }
                          className="text-xs hover:bg-gray-200 px-0.5"
                          title={dict?.entry?.removeOne}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={nextNFT}
          className="w-8 h-8 border border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center text-sm"
          disabled={nftsLoading}
        >
          →
        </button>
      </div>

      <div className="border border-black p-4 bg-white mt-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1 font-medium">{dict?.entry?.comment}</label>
            <textarea
              value={currentAppraisal?.comment || ""}
              onChange={(e) => updateComment(e.target.value)}
              className="w-full p-2 border border-black focus:outline-none text-sm"
              rows={3}
              style={{
                resize: "none",
              }}
              placeholder={dict?.entry?.addComment}
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-medium">{dict?.entry?.overallScore}</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={currentAppraisal?.overallScore || 50}
                onChange={(e) => updateScore(Number(e.target.value))}
                className="flex-1 h-1 bg-gray-200 border border-black appearance-none cursor-pointer"
              />
              <span className="text-xs font-medium w-10 text-center">
                {currentAppraisal?.overallScore || 50}
              </span>
            </div>
          </div>

          <button
            onClick={handleAppraisal}
            disabled={
              !currentAppraisal?.comment ||
              (currentAppraisal?.reactions?.length || 0) === 0 ||
              appraisalLoading ||              appraisalData.length >= 10 ||
              appraisalSuccess
            }
            className={`w-full py-2 px-4 border transition-colors disabled:opacity-50 text-sm ${
              appraisalSuccess 
                ? "border-green-500 bg-green-500 text-white"
                : "border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            {appraisalSuccess
              ? dict?.entry?.appraisalSubmitted
              : appraisalData.length >= 10
              ? dict?.entry?.submitAll10First
              : appraisalLoading
              ? dict?.entry?.submitting
              : dict?.entry?.submitAppraisal}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;
