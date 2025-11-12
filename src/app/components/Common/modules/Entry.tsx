"use client";

import { FunctionComponent, JSX, useContext } from "react";
import useEntry from "../hooks/useEntry";
import { EMOJIS, INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import Metadata from "./Metadata";
import { ModalContext } from "@/app/providers";
import Image from "next/image";
import Notice from "./Notice";

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
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
    handleAppraisalBatch,
  } = useEntry(dict);

  const router = useRouter();
  const context = useContext(ModalContext);

  if (!currentNFT) {
    return <Notice dict={dict} />;
  }

  return (
    <div className="w-full flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper h-full flex">
            <div className="stamp-spots p-4 w-full h-full">
              <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-5 justify-start">
                {floatingEmojis.map((floatingEmoji) => (
                  <div
                    key={floatingEmoji.id}
                    className="fixed pointer-events-none z-[60] float-animation"
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

                {appraisalData.length > 0 && (
                  <div className="text-xs font-aza text-gray-600 text-center">
                    {dict?.entry?.pending}: {appraisalData.length}/10
                  </div>
                )}

                <div className="flex flex-row items-start justify-between gap-4 w-full">
                  <button
                    onClick={previousNFT}
                    className="w-8 h-8 border border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center text-sm flex-shrink-0"
                    disabled={nftsLoading}
                  >
                    ←
                  </button>

                  <div className="flex flex-col items-center justify-center gap-3 min-w-0 max-w-md">
                    {currentNFT.metadata?.title && (
                      <h2 className="stamp-title text-base">
                        {currentNFT.metadata.title}
                      </h2>
                    )}
                    <div className="relative">
                      <div
                        className="w-48 h-48 relative border border-black cursor-pointer"
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
                    </div>
                    {currentNFT.metadata?.description && (
                      <div className="text-xs text-gray-600 text-left max-w-xs">
                        {currentNFT.metadata.description}
                      </div>
                    )}
                    {((currentAppraisal?.reactions?.length || 0) > 0 ||
                      (currentAppraisal?.reactionUsage?.length || 0) > 0) && (
                      <div className="flex gap-1 flex-wrap justify-center max-w-xs">
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
                        {(currentAppraisal?.reactionUsage || []).map(
                          (usage) => {
                            const reaction = context?.userReactions?.find(
                              (r) =>
                                r.reaction.reactionId ===
                                usage.reactionId.toString()
                            )?.reaction;
                            if (!reaction) return null;

                            return (
                              <div
                                key={`reaction_${usage.reactionId}`}
                                className="flex items-center gap-1 bg-white border border-black px-1 py-0.5 text-xs"
                              >
                                <div className="relative w-fit h-fit flex">
                                  <div className="relative w-5 h-5 flex">
                                    <Image
                                      src={`${INFURA_GATEWAY}/ipfs/${
                                        reaction.reactionMetadata.image?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`}
                                      fill
                                      alt={reaction.reactionMetadata.title}
                                      draggable={false}
                                      objectFit="contain"
                                    />
                                  </div>
                                </div>
                                <span>{usage.count}</span>
                                <button
                                  onClick={() =>
                                    decreaseCustomReaction(
                                      usage.reactionId.toString()
                                    )
                                  }
                                  className="text-xs hover:bg-gray-200 px-0.5"
                                  title={dict?.entry?.removeOne}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={nextNFT}
                    className="w-8 h-8 border border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center text-sm flex-shrink-0"
                    disabled={nftsLoading}
                  >
                    →
                  </button>
                </div>

                <div className="w-full space-y-4 mt-5">
                  <div>
                    <label className="block text-xs mb-2 font-aza">
                      REACTIONS
                    </label>
                    <div className="relative mb-3 flex flex-row gap-2 w-full flex-wrap justify-center items-center">
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

                    {context?.userReactions &&
                      context.userReactions.length > 0 && (
                        <div className="border-t border-gray-300 pt-3">
                          <div className="text-xs mb-2 font-aza">
                            {dict?.entry?.customReactions}
                          </div>
                          <div className="relative mb-3 flex flex-row gap-2 w-full flex-wrap justify-center items-center">
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
                                      const rect =
                                        e.currentTarget.getBoundingClientRect();
                                      handleCustomReactionClick(
                                        item.reaction.reactionId,
                                        `${INFURA_GATEWAY}/ipfs/${
                                          item.reaction.reactionMetadata.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`,
                                        rect.left + rect.width / 2,
                                        rect.top + rect.height / 2,
                                        item.count
                                      );
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
                                        src={`${INFURA_GATEWAY}/ipfs/${
                                          item.reaction.reactionMetadata.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`}
                                        alt={
                                          item.reaction.reactionMetadata.title
                                        }
                                        draggable={false}
                                        fill
                                        objectFit="contain"
                                      />
                                    </div>
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs px-1">
                                      {item.count - currentCount}
                                    </span>
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div>
                    <label className="block text-xs mb-1 font-aza">
                      {dict?.entry?.comment}
                    </label>
                    <textarea
                      value={currentAppraisal?.comment || ""}
                      onChange={(e) => updateComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 focus:outline-none focus:border-black text-xs"
                      rows={3}
                      style={{
                        resize: "none",
                      }}
                      placeholder={dict?.entry?.addComment}
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-2 font-aza">
                      {dict?.entry?.overallScore}
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentAppraisal?.overallScore || 50}
                        onChange={(e) => updateScore(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 border border-black appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs w-10 text-center">
                        {currentAppraisal?.overallScore || 50}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAppraisal}
                    disabled={
                      !currentAppraisal?.comment ||
                      (currentAppraisal?.reactions?.length || 0) === 0 ||
                      appraisalLoading ||
                      appraisalData.length >= 10 ||
                      appraisalSuccess
                    }
                    className={`w-full py-2 px-4 text-xs rounded transition-all ${
                      appraisalSuccess
                        ? "bg-green-500 text-white"
                        : "bg-black disabled:bg-gray-400 text-white cursor-pointer"
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

                {appraisalData.length >= 10 && (
                  <button
                    onClick={handleAppraisalBatch}
                    disabled={appraisalLoading || appraisalSuccess}
                    className={`w-full py-2 px-4 text-xs rounded transition-all mt-2 ${
                      appraisalSuccess
                        ? "bg-green-500 text-white"
                        : "bg-black disabled:bg-gray-400 text-white cursor-pointer"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entry;
