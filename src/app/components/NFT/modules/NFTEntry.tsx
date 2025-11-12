"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import useNFT from "../hooks/useNFT";
import useAppraise from "../hooks/useAppraise";
import Image from "next/image";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import { EMOJIS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import {
  formatAddress,
  formatDate,
  getExplorerUrl,
} from "@/app/lib/helpers/getExplorerUrl";

const NFTEntry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { nftContract, nftId } = useParams();
  const { nft, nftLoading } = useNFT(nftContract as string, Number(nftId));
  const router = useRouter();
  const context = useContext(ModalContext);
  const network = getCurrentNetwork();

  const {
    appraisalData,
    appraisalLoading,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
    handleAppraisal,
  } = useAppraise(nftContract as string, Number(nftId), dict);

  if (nftLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.nft?.loading}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.nft?.notFound}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
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

      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-4 justify-start items-center">
            <div className="stamp-grid-background"></div>

            <div className="flex flex-col gap-4 p-4 items-center justify-center relative">
              {nft.metadata?.image && (
                <div className="w-full md:w-40 h-40 relative shrink-0 mx-auto md:mx-0">
                  <Image
                    fill
                    src={
                      nft.metadata.image?.includes("ipfs://")
                        ? `${INFURA_GATEWAY}/ipfs/${
                            nft.metadata.image?.split("ipfs://")?.[1]
                          }`
                        : nft.metadata.image
                    }
                    alt={nft.metadata?.title}
                    className="object-contain"
                    draggable={false}
                  />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="flex flex-col items-center justify-start gap-2">
                  <div>
                    <h1 className="stamp-title">{nft.metadata?.title}</h1>
                  </div>
                  <div className="text-left sm:text-right text-sm space-y-1">
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <div>
                        <span>{nft.appraisalCount}</span>{" "}
                        {dict?.nft?.appraisals}
                      </div>
                      <div>
                        <span>{nft.averageScore}</span> {dict?.nft?.avg}
                      </div>
                      <div>
                        <span>{nft.totalScore}</span> {dict?.nft?.total}
                      </div>
                    </div>
                  </div>
                </div>

                {nft.metadata?.description && (
                  <p className="text-xs font-mid text-gray-600 line-clamp-2">
                    {nft.metadata.description}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-aza">
                  <div>
                    {dict?.nft?.token}: <span>{nft.tokenId}</span>
                  </div>
                  <div>
                    {dict?.nft?.type}: <span>{nft.tokenType}</span>
                  </div>
                  <div>
                    {dict?.nft?.status}:{" "}
                    <span
                      className={
                        nft.active === true ? "text-green-600" : "text-red-600"
                      }
                    >
                      {nft.active === true
                        ? dict?.nft?.active
                        : dict?.nft?.inactive}
                    </span>
                  </div>
                </div>
                <a
                  className="text-xs font-aza cursor-pointer"
                  href={getExplorerUrl(network, nft.nftContract, true)}
                >
                  {dict?.nft?.contract}:{" "}
                  <span>{formatAddress(nft.nftContract)}</span>
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 border-b border-gray-300 bg-gray-50">
                {context?.conductor && (
                  <button
                    onClick={() => setShowEmojiPanel(true)}
                    className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800 w-fit rounded"
                  >
                    + {dict?.nft?.appraise}
                  </button>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 relative h-fit">
              {nft.appraisals && nft.appraisals.length > 0 ? (
                nft.appraisals.map((appraisal) => (
                  <div
                    key={appraisal.appraisalId}
                    className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex flex-col relative w-full h-fit items-start justify-start font-mid"
                  >
                    <div className="flex flex-row w-full h-fit items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
                        <div className="text-sm flex w-fit h-fit relative">
                          {appraisal.overallScore}/100
                        </div>
                        <div className="flex text-xs w-fit h-fit relative">
                          <a
                            href={getExplorerUrl(
                              network,
                              appraisal.transactionHash
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            TX
                          </a>
                        </div>
                      </div>

                      <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
                        <div
                          className="cursor-pointer flex items-center"
                          onClick={() =>
                            router.push(
                              `/conductor/${appraisal.conductor?.conductorId}`
                            )
                          }
                        >
                          {appraisal.conductor?.metadata?.image && (
                            <div className="w-6 h-6 relative border border-gray-300">
                              <Image
                                fill
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  appraisal.conductor.metadata.image?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                alt={appraisal.conductor.metadata.title}
                                className="object-cover"
                                draggable={false}
                              />
                            </div>
                          )}
                        </div>
                        <div className="text-xs flex text-gray-500">
                          {formatDate(appraisal.blockTimestamp)}
                        </div>
                      </div>
                    </div>

                    {appraisal.metadata?.comment && (
                      <div className="mb-3 flex flex-col gap-2 w-full h-fit items-start justify-start text-left">
                        <div className="text-sm font-aza text-gray-600 mb-1 font-aza flex">
                          {dict?.nft?.comment}
                        </div>
                        <div className="text-xs text-left w-full h-fit flex">
                          {appraisal.metadata.comment}
                        </div>
                      </div>
                    )}

                    {(appraisal.metadata?.reactions?.length > 0 ||
                      appraisal.reactions?.length > 0) && (
                      <div className="mb-3 flex flex-col gap-2 w-full h-fit items-start justify-start">
                        <div className="text-sm font-aza text-gray-600 mb-1 font-aza ">
                          {dict?.nft?.reactions}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {appraisal.metadata?.reactions?.map(
                            (reaction, idx) => (
                              <span
                                key={idx}
                                className="text-xs flex flex-row flex-wrap gap-1 items-center justify-center"
                              >
                                <div className="relative w-fit h-fit flex">
                                  {reaction.emoji}
                                </div>

                                <span className="text-gray-600 ml-0.5 flex">
                                  x{reaction.count}
                                </span>
                              </span>
                            )
                          )}
                          {appraisal.reactions?.map((reaction, idx) => (
                            <span
                              key={idx}
                              className="text-xs flex flex-row flex-wrap gap-1 items-center justify-center cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/reaction-pack/${reaction.reaction.packId}`
                                )
                              }
                            >
                              <div className="relative w-fit h-fit flex">
                                <div className="relative w-4 h-4 flex">
                                  <Image
                                    draggable={false}
                                    alt={
                                      reaction.reaction.reactionMetadata?.title
                                    }
                                    layout="fill"
                                    objectFit="contain"
                                    src={`${INFURA_GATEWAY}/ipfs/${
                                      reaction.reaction.reactionMetadata?.image?.split(
                                        "ipfs://"
                                      )?.[1]
                                    }`}
                                  />
                                </div>
                              </div>
                              <span className="text-gray-600 ml-0.5 flex">
                                x{reaction.count}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-gray-600">
                  {dict?.nft?.noAppraisals}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEmojiPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 cursor-pointer"
          onClick={() => setShowEmojiPanel(false)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="stamp-border cursor-default">
              <div className="stamp-content-wrapper overflow-y-auto max-h-[90vh] flex flex-col gap-4 p-4">
                <div className="stamp-grid-background"></div>
                <div className="flex justify-between items-center relative">
                  <h3 className="text-base font-aza">
                    {dict?.nft?.appraiseNft}
                  </h3>
                  <button
                    onClick={() => setShowEmojiPanel(false)}
                    className="absolute top-0 right-0 text-xl hover:bg-gray-100 w-7 h-7 flex items-center justify-center z-50"
                  >
                    ×
                  </button>
                </div>

                <div className="relative w-full flex flex-col gap-3">
                  <div>
                    <label className="block text-xs mb-2 font-aza">
                      {dict?.nft?.comment}
                    </label>
                    <textarea
                      value={appraisalData?.comment}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateComment(e.target.value);
                      }}
                      className="w-full p-2 border border-black focus:outline-none text-xs"
                      rows={5}
                      style={{ resize: "none" }}
                      placeholder={dict?.nft?.addComment}
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-2 font-aza">
                      {dict?.nft?.overallScore}
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={appraisalData?.overallScore}
                        onChange={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateScore(Number(e.target.value));
                        }}
                        className="flex-1 h-2 bg-gray-200 border border-black appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs w-10 text-center">
                        {appraisalData?.overallScore}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-2 font-aza">
                      {dict?.nft?.reactions}
                    </label>
                    <div className="relative mb-3 flex flex-row gap-2 w-full flex-wrap justify-center items-center">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEmojiButtonClick(emoji, e);
                          }}
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
                            {dict?.nft?.customReactions}
                          </div>
                          <div className="relative mb-3 flex flex-row gap-2 w-full flex-wrap justify-center items-center">
                            {context.userReactions.map(
                              (item: { reaction: any; count: number }) => {
                                const currentUsage =
                                  appraisalData?.reactionUsage?.find(
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
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleCustomReactionClick(
                                        item.reaction.reactionId,
                                        `${INFURA_GATEWAY}/ipfs/${
                                          item.reaction.reactionMetadata?.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`,
                                        rect.left + rect.width / 2,
                                        rect.top + rect.height / 2,
                                        item.count
                                      );
                                    }}
                                    disabled={isDisabled}
                                    className={`relative border border-gray-300 hover:border-black p-1 ${
                                      isDisabled ? "opacity-50" : ""
                                    }`}
                                    title={`${item.reaction.reactionMetadata.title} (${currentCount}/${item.count})`}
                                  >
                                    <div className="w-5 h-5 relative">
                                      <Image
                                        src={`${INFURA_GATEWAY}/ipfs/${
                                          item.reaction.reactionMetadata?.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`}
                                        alt={
                                          item.reaction.reactionMetadata.title
                                        }
                                        draggable={false}
                                        fill
                                        className="contain"
                                      />
                                    </div>
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs px-1">
                                      {item.count}
                                    </span>
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {((appraisalData?.reactions?.length || 0) > 0 ||
                    (appraisalData?.reactionUsage?.length || 0) > 0) && (
                    <div className="flex gap-2 flex-wrap w-full h-fit flex-row justify-center items-center">
                      {(appraisalData?.reactions || []).map((reaction) => (
                        <div
                          key={reaction.emoji}
                          className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-xs"
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              decreaseEmoji(reaction.emoji);
                            }}
                            className="text-xs hover:bg-gray-200 px-1"
                            title={dict?.nft?.removeOne}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(appraisalData?.reactionUsage || []).map((usage) => {
                        const reaction = context?.userReactions?.find(
                          (r) =>
                            r.reaction.reactionId ===
                            usage.reactionId.toString()
                        )?.reaction;
                        if (!reaction) return null;
                        return (
                          <div
                            key={`reaction_${usage.reactionId}`}
                            className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-xs"
                          >
                            <div className="w-5 h-5 relative">
                              <Image
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  reaction.reactionMetadata?.image?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                alt={reaction.reactionMetadata.title}
                                draggable={false}
                                fill
                                className="contain"
                              />
                            </div>
                            <span>{usage.count}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                decreaseCustomReaction(
                                  usage.reactionId.toString()
                                );
                              }}
                              className="text-xs hover:bg-gray-200 px-1"
                              title={dict?.nft?.removeOne}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={handleAppraisal}
                    disabled={
                      !appraisalData?.comment ||
                      (appraisalData?.reactions?.length || 0) === 0 ||
                      appraisalLoading
                    }
                    className={`w-full py-2 px-4 border text-xs disabled:opacity-50 rounded border-black text-black hover:bg-black hover:text-white`}
                  >
                    {appraisalLoading
                      ? dict?.nft?.submitting
                      : dict?.nft?.submitAppraisal}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTEntry;
