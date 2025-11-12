"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import useConductor from "../hooks/useConductor";
import Image from "next/image";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import { EMOJIS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import {
  formatAddress,
  formatDate,
  getExplorerUrl,
} from "@/app/lib/helpers/getExplorerUrl";

const ConductorEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { conductor: conductorId } = useParams();
  const {
    conductor,
    conductorLoading,
    handleReview,
    reviewLoading,
    reviewData,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
  } = useConductor(Number(conductorId), dict);
  const router = useRouter();
  const context = useContext(ModalContext);
  const network = getCurrentNetwork();
  if (conductorLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.conductor?.loading}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!conductor) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.conductor?.notFound}
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
          <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-5 justify-start p-4 relative">
            <div className="stamp-grid-background"></div>

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

            <div className="stamp-spots p-4 w-full">
              <div className="stamp-content-wrapper p-4">
                <div className="stamp-grid-background"></div>
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  <div className="flex flex-col lg:flex-row gap-4 relative w-full h-fit flex-wrap">
                    {conductor.metadata?.image && (
                      <div className="w-full lg:w-48 h-48 relative border border-black shrink-0 mx-auto lg:mx-0">
                        <Image
                          fill
                          src={
                            conductor.metadata.image?.includes("ipfs://")
                              ? `${INFURA_GATEWAY}/ipfs/${
                                  conductor.metadata.image?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`
                              : conductor.metadata.image
                          }
                          alt={conductor.metadata.title}
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div className="text-center lg:text-left">
                          <h1 className="stamp-title">
                            {conductor.metadata?.title}
                          </h1>
                          <p className="text-xs font-aza text-gray-600">
                            {dict?.conductor?.conductorId}: #
                            {conductor.conductorId}
                          </p>
                        </div>
                      </div>

                      {conductor.metadata?.description && (
                        <p className="text-xs font-mid text-gray-600 line-clamp-3 justify-start items-start w-full flex break-all text-left">
                          {conductor.metadata.description}
                        </p>
                      )}

                      <div className="flex flex-row flex-wrap w-full h-fit gap-3 text-xs font-aza items-center justify-center">
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {conductor.appraisalCount ?? 0}
                          </div>
                          <div className="text-gray-600">
                            {dict?.conductor?.totalAppraisals}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {conductor.averageScore ?? 0}
                          </div>
                          <div className="text-gray-600">
                            {dict?.conductor?.averageScore}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {conductor.reviewCount ?? 0}
                          </div>
                          <div className="text-gray-600">
                            {dict?.conductor?.totalReviews}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {conductor.inviteCount ?? 0}
                          </div>
                          <div className="text-gray-600">
                            {dict?.conductor?.totalInvites}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-aza text-gray-600">
                        {dict?.conductor?.created}{" "}
                        {formatDate(conductor.blockTimestamp)} |{" "}
                        <a
                          href={getExplorerUrl(
                            network,
                            conductor.transactionHash
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {dict?.conductor?.viewCreationTX}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stamp-spots p-4 w-full">
              <div className="stamp-content-wrapper p-4">
                <div className="stamp-grid-background"></div>
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center items-center sm:justify-between gap-2">
                    <h2 className="stamp-title text-base">
                      {dict?.conductor?.appraisals} (
                      {conductor.appraisalCount ?? 0})
                    </h2>
                  </div>
                  <div className="max-h-96 overflow-y-auto flex flex-col gap-3">
                    {conductor.appraisals && conductor.appraisals.length > 0 ? (
                      conductor.appraisals.map((appraisal) => (
                        <div
                          key={appraisal.appraisalId}
                          className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 w-full relative">
                            <div className="flex items-center gap-2 text-xs font-aza">
                              <span className="bg-black text-white px-2 py-1">
                                #{appraisal.appraisalId}
                              </span>
                              <span className="text-sm font-brass">
                                {appraisal.overallScore}/100
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(appraisal.blockTimestamp)}
                            </div>
                          </div>

                          <div
                            className="border border-black hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() =>
                              router.push(
                                `/nft/${appraisal.nft?.nftContract}/${appraisal.nft?.nftId}`
                              )
                            }
                          >
                            {appraisal.nft?.metadata?.image && (
                              <div className="w-fit h-fit aspect-square relative border-b border-black">
                                <div className="relative w-10 flex h-10">
                                  <Image
                                    fill
                                    draggable={false}
                                    src={
                                      appraisal.nft?.metadata.image?.includes(
                                        "ipfs://"
                                      )
                                        ? `${INFURA_GATEWAY}/ipfs/${
                                            appraisal.nft?.metadata.image?.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`
                                        : appraisal.nft?.metadata.image
                                    }
                                    alt={appraisal.nft?.metadata.title || "NFT"}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {appraisal.metadata?.comment && (
                            <div className="px-3 py-2 border border-gray-200 bg-white text-xs font-mid text-gray-700 w-full text-left break-all">
                              {appraisal.metadata.comment}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 text-xs">
                            {appraisal.metadata?.reactions?.map(
                              (reaction, idx: number) => (
                                <span
                                  key={`emoji-${idx}`}
                                  className="px-2 py-1 border border-gray-200 bg-white flex items-center gap-1 justify-center"
                                >
                                  <span className="flex w-fit h-fit relative">
                                    {reaction.emoji}
                                  </span>
                                  <span className="flex w-fit h-fit relative text-[10px] text-gray-500">
                                    x{reaction.count}
                                  </span>
                                </span>
                              )
                            )}
                            {appraisal.reactions?.map(
                              (reaction, idx: number) => (
                                <span
                                  key={`reaction-${idx}`}
                                  className="px-2 py-1 border border-gray-200 bg-white flex items-center gap-1 justify-center"
                                >
                                  <div className="flex w-fit h-fit relative">
                                    <div className="flex w-4 h-4 relative">
                                      <Image
                                        objectFit="contain"
                                        layout="fill"
                                        src={`${INFURA_GATEWAY}/ipfs/${
                                          reaction?.reaction?.reactionMetadata?.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`}
                                        alt={
                                          reaction?.reaction?.reactionMetadata
                                            ?.title
                                        }
                                      />
                                    </div>
                                  </div>
                                  <span className="flex w-fit h-fit relative text-[10px] text-gray-500">
                                    x{reaction.count}
                                  </span>
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-600">
                        {dict?.conductor?.noAppraisals}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="stamp-spots p-4 w-full">
              <div className="stamp-content-wrapper p-4">
                <div className="stamp-grid-background"></div>
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="stamp-title text-base">
                      {dict?.conductor?.reviewsReceived} (
                      {conductor.reviewCount ?? 0})
                    </h2>
                    <button
                      onClick={() => setShowEmojiPanel(true)}
                      className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800 w-fit rounded"
                    >
                      {dict?.conductor?.reviewConductor}
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto flex flex-col gap-3">
                    {conductor.reviews && conductor.reviews.length > 0 ? (
                      conductor.reviews.map((review) => (
                        <div
                          key={review.reviewId}
                          className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 w-full relative">
                            <div className="flex items-center gap-2 text-xs font-aza">
                              <span className="bg-black text-white px-2 py-1">
                                #{review.reviewId}
                              </span>
                              <span className="text-sm font-brass">
                                {review.reviewScore}/100
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(review.timestamp)}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-aza text-gray-600 w-full relative">
                            <div className="relative w-fit h-fit flex gap-2 items-center justify-center flex-wrap flex-row">
                              {review?.reviewer?.metadata?.image && (
                                <div className="relative w-fit h-fit flex">
                                  <div className="relative w-5 h-5 flex">
                                    <Image
                                      fill
                                      src={`${INFURA_GATEWAY}/ipfs/${
                                        review?.reviewer?.metadata?.image?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`}
                                      alt={review?.reviewer?.metadata?.title}
                                      className="object-cover"
                                      draggable={false}
                                    />
                                  </div>
                                </div>
                              )}
                              <span>
                                {review.reviewer?.metadata?.title ||
                                  formatAddress(review.reviewer?.wallet)}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                router.push(
                                  `/reviewer/${review.reviewer?.wallet}`
                                )
                              }
                              className="text-blue-600 hover:underline"
                            >
                              {dict?.conductor?.viewReviewerProfile}
                            </button>
                          </div>

                          {review.metadata?.comment && (
                            <div className="px-3 py-2 border border-gray-200 bg-white text-xs font-mid text-gray-700 w-full text-left break-all">
                              {review.metadata.comment}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 text-xs">
                            {review.metadata?.reactions?.map(
                              (reaction, idx: number) => (
                                <span
                                  key={`emoji-${idx}`}
                                  className="px-2 py-1 border border-gray-200 bg-white flex items-center gap-1 justify-center"
                                >
                                  <span className="flex w-fit h-fit relative">
                                    {reaction.emoji}
                                  </span>
                                  <span className="flex w-fit h-fit relative text-[10px] text-gray-500">
                                    x{reaction.count}
                                  </span>
                                </span>
                              )
                            )}
                            {review.reactions?.map((reaction, idx: number) => (
                              <span
                                key={`reaction-${idx}`}
                                className="px-2 py-1 border border-gray-200 bg-white flex items-center gap-1 justify-center"
                              >
                                <div className="flex w-fit h-fit relative">
                                  <div className="flex w-4 h-4 relative">
                                    <Image
                                      objectFit="contain"
                                      layout="fill"
                                      src={`${INFURA_GATEWAY}/ipfs/${
                                        reaction?.reaction?.reactionMetadata?.image?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`}
                                      alt={
                                        reaction?.reaction?.reactionMetadata
                                          ?.title
                                      }
                                    />
                                  </div>
                                </div>
                                <span className="flex w-fit h-fit relative text-[10px] text-gray-500">
                                  x{reaction.count}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-600">
                        {dict?.conductor?.noReviews}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="stamp-spots p-4 w-full h-full">
              <div className="stamp-content-wrapper p-4 h-full">
                <div className="stamp-grid-background"></div>
                <div className="relative z-10 flex flex-col gap-4 w-full h-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="stamp-title text-base">
                      {dict?.conductor?.invitedDesigners} (
                      {conductor.invitedDesigners?.length || 0})
                    </h2>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {conductor.invitedDesigners &&
                    conductor.invitedDesigners.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {conductor.invitedDesigners.map(
                          (designer, idx: number) => (
                            <div
                              key={idx}
                              className="h-fit w-fit border border-black cursor-pointer relative flex"
                              onClick={() =>
                                router.push(`/designer/${designer.wallet}`)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  router.push(`/designer/${designer.wallet}`);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="p-3 h-full">
                                <div className="relative z-10 flex items-center justify-center flex-col gap-3 h-full">
                                  {designer.metadata?.image && (
                                    <div className="w-full h-24 relative border border-black">
                                      <Image
                                        fill
                                        src={
                                          designer.metadata.image?.includes(
                                            "ipfs://"
                                          )
                                            ? `${INFURA_GATEWAY}/ipfs/${
                                                designer.metadata.image?.split(
                                                  "ipfs://"
                                                )?.[1]
                                              }`
                                            : designer.metadata.image
                                        }
                                        alt={designer.metadata.title}
                                        className="object-cover"
                                        draggable={false}
                                      />
                                    </div>
                                  )}

                                  <div className="flex flex-col gap-1">
                                    <div className="text-sm font-aza line-clamp-1">
                                      {designer.metadata?.title ||
                                        dict?.conductor?.unnamedDesigner}
                                    </div>
                                    {designer.designerId && (
                                      <div className="text-xs font-aza text-gray-600">
                                        {dict?.designer?.designerId}: #
                                        {designer.designerId}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs font-aza text-gray-600">
                                    {dict?.conductor?.wallet}:{" "}
                                    {formatAddress(designer.wallet)}
                                  </div>
                                  <div className="flex items-center justify-between text-xs font-aza mt-auto">
                                    <span className="text-gray-500">
                                      {dict?.conductor?.invited}
                                    </span>
                                    <span className="text-blue-600">
                                      {dict?.conductor?.viewDesignerProfile}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-600">
                        {dict?.conductor?.noInvitedDesigners}
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
                <div
                  className="w-full max-w-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="stamp-border cursor-default">
                    <div className="stamp-content-wrapper overflow-y-auto max-h-[90vh] flex flex-col gap-4 p-4">
                      <div className="stamp-grid-background"></div>
                      <div className="flex justify-between items-center relative">
                        <h3 className="stamp-title text-base">
                          {dict?.conductor?.reviewConductor}
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
                            {dict?.conductor?.comment}
                          </label>
                          <textarea
                            value={reviewData?.comment}
                            onChange={(e) => updateComment(e.target.value)}
                            className="w-full p-2 border border-black focus:outline-none text-xs"
                            rows={4}
                            style={{ resize: "none" }}
                            placeholder={dict?.conductor?.commentPlaceholder}
                          />
                        </div>

                        <div>
                          <label className="block text-xs mb-2 font-aza">
                            {dict?.conductor?.reviewScore}
                          </label>
                          <div className="flex items-center gap-3 flex-wrap">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={reviewData?.reviewScore}
                              onChange={(e) =>
                                updateScore(Number(e.target.value))
                              }
                              className="flex-1 h-2 bg-gray-200 border border-black appearance-none cursor-pointer slider"
                            />
                            <span className="text-xs w-10 text-center">
                              {reviewData?.reviewScore}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs mb-2 font-aza">
                            {dict?.conductor?.reactions}
                          </label>
                          <div className="relative mb-3 flex flex-row gap-2 w-full flex-wrap justify-center items-center">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={(e) =>
                                  handleEmojiButtonClick(emoji, e)
                                }
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
                                  {dict?.conductor?.customReactions}
                                </div>
                                <div className="relative mb-3 flex flex-row gap-2 w-full flex-wrap justify-center items-center">
                                  {context.userReactions.map(
                                    (item: {
                                      reaction: any;
                                      count: number;
                                    }) => {
                                      const currentUsage =
                                        reviewData?.reactionUsage?.find(
                                          (r) =>
                                            r.reactionId ===
                                            Number(item.reaction.reactionId)
                                        );
                                      const currentCount = currentUsage
                                        ? currentUsage.count
                                        : 0;
                                      const isDisabled =
                                        currentCount >= item.count;

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
                                              src={
                                                item.reaction.reactionMetadata.image?.includes(
                                                  "ipfs://"
                                                )
                                                  ? `${INFURA_GATEWAY}/ipfs/${
                                                      item.reaction.reactionMetadata.image?.split(
                                                        "ipfs://"
                                                      )?.[1]
                                                    }`
                                                  : item.reaction
                                                      .reactionMetadata.image
                                              }
                                              alt={
                                                item.reaction.reactionMetadata
                                                  .title
                                              }
                                              fill
                                              objectFit="contain"
                                            />
                                          </div>
                                          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] px-1">
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

                        {((reviewData?.reactions?.length || 0) > 0 ||
                          (reviewData?.reactionUsage?.length || 0) > 0) && (
                          <div className="flex gap-2 flex-wrap">
                            {(reviewData?.reactions || []).map((reaction) => (
                              <div
                                key={reaction.emoji}
                                className="flex items-center gap-1 bg-white border border-black px-2 py-1 text-xs"
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                                <button
                                  onClick={() => decreaseEmoji(reaction.emoji)}
                                  className="text-xs hover:bg-gray-200 px-1"
                                  title={dict?.conductor?.removeOne}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {(reviewData?.reactionUsage || []).map((usage) => {
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
                          onClick={handleReview}
                          disabled={
                            !reviewData?.comment ||
                            ((reviewData?.reactions?.length || 0) === 0 &&
                              (reviewData?.reactionUsage?.length || 0) === 0) ||
                            reviewLoading
                          }
                          className={`w-full py-2 px-4 border text-xs rounded transition-all disabled:opacity-50 border-black text-black hover:bg-black hover:text-white`}
                        >
                          {reviewLoading
                            ? dict?.conductor?.submitting
                            : dict?.conductor?.submitReview}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductorEntry;
