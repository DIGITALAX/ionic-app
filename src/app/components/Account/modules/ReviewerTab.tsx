"use client";

import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/image";
import useReviewer from "../hooks/useReviewer";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";
import { formatAddress, formatDate } from "@/app/lib/helpers/getExplorerUrl";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const ReviewerTab: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const {
    updateLoading,
    handleUpdateReviewer,
    form,
    setForm,
    reviews,
    reviewsLoading,
    hasMoreReviews,
    loadMoreReviews,
    imagePreview,
  } = useReviewer(dict);

  return (
    <div className="space-y-3">
      <div className="p-4 w-full flex flex-col text-left justify-start items-start">
        <div className="flex justify-between items-center w-full mb-3 flex-wrap">
          <div className="stamp-title mb-0">
            {dict?.account?.reviewer?.profile}
          </div>
          <button
            onClick={() => router.push(`/reviewer/${address}`)}
            className="text-xxs text-gray-600 hover:text-black underline hover:no-underline transition-all font-brass"
          >
            {dict?.account?.reviewer?.viewProfilePage}
          </button>
        </div>
        <form className="space-y-3 relative w-full flex flex-col items-start justify-start">
          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
            <div>
              <label className="block text-xs mb-1 font-aza">
                {dict?.account?.reviewer?.title}
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                placeholder={dict?.account?.reviewer?.titlePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-aza">
                {dict?.account?.reviewer?.image}
              </label>
              <label className="relative inline-block w-6 h-6 border border-black cursor-pointer hover:bg-gray-200 overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    draggable={false}
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs bg-black text-white">
                    +
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || "",
                    }))
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="relative w-full flex text-left items-start flex-col justify-start">
            <label className="block text-xs mb-1 font-aza">
              {dict?.account?.reviewer?.description}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
              placeholder={dict?.account?.reviewer?.descriptionPlaceholder}
            />
          </div>
          <button
            type="button"
            onClick={handleUpdateReviewer}
            disabled={
              updateLoading || !form.title.trim() || !form.description.trim()
            }
            className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
          >
            {updateLoading
              ? dict?.account?.reviewer?.updating
              : dict?.account?.reviewer?.update}
          </button>
          <div className="relative w-full h-72 flex mt-4">
            <Image
              layout="fill"
              objectFit="cover"
              src={"/images/bailando.png"}
              draggable={false}
              alt="Cows"
            />
          </div>
        </form>
      </div>

      <div className="border border-black p-3">
        <div className="text-base mb-3">
          {dict?.account?.reviewer?.statistics}
        </div>
        <div className="flex flex-row flex-wrap gap-2 justify-center items-center relative w-full h-fit">
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">{context?.reviewer?.reviewCount ?? 0}</div>
            <div className="text-xs text-gray-600">
              {dict?.account?.reviewer?.reviews}
            </div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">{context?.reviewer?.totalScore ?? 0}</div>
            <div className="text-xs text-gray-600">
              {dict?.account?.reviewer?.totalScore}
            </div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {context?.reviewer?.averageScore ?? 0}
            </div>
            <div className="text-xs text-gray-600">
              {dict?.account?.reviewer?.avgScore}
            </div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {context?.reviewer?.lastReviewTimestamp
                ? new Date(
                    Number(context?.reviewer?.lastReviewTimestamp) * 1000
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : 0}
            </div>
            <div className="text-xs text-gray-600">
              {dict?.account?.reviewer?.lastReview}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-black p-3">
        <div className="text-base mb-3">
          {dict?.account?.reviewer?.recentReviews}
        </div>
        <div
          id="reviews-scroll"
          className="h-64 overflow-auto border border-gray-300"
        >
          <InfiniteScroll
            dataLength={reviews.length}
            next={loadMoreReviews}
            hasMore={hasMoreReviews}
            loader={
              <div className="text-center py-2 text-xs">
                {reviewsLoading ? dict?.account?.reviewer?.loadingReviews : ""}
              </div>
            }
            scrollableTarget="reviews-scroll"
          >
            <div className="space-y-1 p-2">
              {reviews.map((review) => (
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
                        router.push(`/reviewer/${review.reviewer?.wallet}`)
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
                    {review.reactions?.map((reaction, idx: number) => (
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
                              alt={reaction.reaction.reactionMetadata?.title}
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
              ))}

              {reviews.length === 0 && !reviewsLoading && (
                <div className="text-center py-6 text-xs text-gray-600">
                  {dict?.account?.reviewer?.noReviews}
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ReviewerTab;
