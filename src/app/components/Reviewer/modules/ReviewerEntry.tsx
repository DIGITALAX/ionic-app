"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX } from "react";
import useReviewer from "../hooks/useReviewer";
import Image from "next/image";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import {
  formatAddress,
  formatDate,
  getExplorerUrl,
} from "@/app/lib/helpers/getExplorerUrl";

const ReviewerEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { reviewer: reviewerAddress } = useParams();
  const { reviewer, reviewerLoading } = useReviewer(reviewerAddress as string);
  const router = useRouter();
  const network = getCurrentNetwork();
  if (reviewerLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.reviewer?.loading}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reviewer) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.reviewer?.notFound}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const reviewCount = Number(reviewer.reviewCount ?? 0);
  const averageScore = Number(reviewer.averageScore ?? 0);
  const totalScore = Number(reviewer.totalScore ?? 0);

  return (
    <div className="w-full flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-5 justify-start p-4 relative">
            <div className="stamp-grid-background"></div>

            <div className="stamp-spots p-4 w-full">
              <div className="stamp-content-wrapper p-4">
                <div className="stamp-grid-background"></div>
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  <div className="flex flex-col lg:flex-row gap-4 relative w-full h-fit flex-wrap">
                    {reviewer.metadata?.image && (
                      <div className="w-full lg:w-48 h-48 relative border border-black shrink-0 mx-auto lg:mx-0">
                        <Image
                          fill
                          src={`${INFURA_GATEWAY}/ipfs/${
                            reviewer.metadata.image?.split("ipfs://")?.[1]
                          }`}
                          alt={reviewer.metadata.title}
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div className="text-center lg:text-left">
                          <h1 className="stamp-title">
                            {reviewer.metadata?.title ||
                              dict?.reviewer?.defaultTitle}
                          </h1>
                          <p className="text-xs font-aza text-gray-600">
                            {formatAddress(reviewer?.wallet)}
                          </p>
                        </div>
                        <div className="text-xs font-aza text-gray-500">
                          {dict?.reviewer?.reviews}: {reviewCount}
                        </div>
                      </div>

                      {reviewer.metadata?.description && (
                        <p className="text-xs font-mid text-gray-600 line-clamp-3 justify-start items-start w-full flex break-all text-left">
                          {reviewer.metadata.description}
                        </p>
                      )}

                      <div className="flex flex-row flex-wrap w-full h-fit gap-3 text-xs font-aza items-center justify-center">
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {reviewCount}
                          </div>
                          <div className="text-gray-600">
                            {dict?.reviewer?.reviews}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {averageScore.toFixed(2)}
                          </div>
                          <div className="text-gray-600">
                            {dict?.reviewer?.avgScore}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {totalScore}
                          </div>
                          <div className="text-gray-600">
                            {dict?.reviewer?.totalScore}
                          </div>
                        </div>
                        <div className="border border-gray-300 p-3 bg-white/70 text-center">
                          <div className="text-base font-brass">
                            {reviewer.lastReviewTimestamp
                              ? formatDate(reviewer.lastReviewTimestamp)
                              : "—"}
                          </div>
                          <div className="text-gray-600">
                            {dict?.reviewer?.lastReview}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-aza text-gray-600">
                        {dict?.conductor?.created}{" "}
                        {formatDate(reviewer.blockTimestamp)} |{" "}
                        <a
                          href={getExplorerUrl(
                            network,
                            reviewer.transactionHash
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="stamp-title text-base">
                      {dict?.reviewer?.reviewsGiven} ({reviewCount})
                    </h2>
                  </div>

                  <div className="max-h-80 overflow-y-auto flex flex-col gap-3">
                    {reviewer.reviews && reviewer.reviews.length > 0 ? (
                      reviewer.reviews.map((review) => (
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
                              {review?.conductor?.metadata?.image && (
                                <div className="relative w-fit h-fit flex">
                                  <div className="relative w-5 h-5 flex">
                                    <Image
                                      fill
                                      src={`${INFURA_GATEWAY}/ipfs/${
                                        review?.conductor?.metadata?.image?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`}
                                      alt={review?.conductor?.metadata?.title}
                                      className="object-cover"
                                      draggable={false}
                                    />
                                  </div>
                                </div>
                              )}
                              <span>
                                {review.conductor?.metadata?.title ||
                                  review.conductor?.conductorId}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                router.push(`/conductor/${review.conductorId}`)
                              }
                              className="text-blue-600 hover:underline"
                            >
                              {dict?.reviewer?.viewConductorProfile}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerEntry;
