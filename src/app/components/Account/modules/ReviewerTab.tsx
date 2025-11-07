"use client";

import { FunctionComponent, JSX, useContext } from "react";
import useReviewer from "../hooks/useReviewer";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";

const ReviewerTab: FunctionComponent<{dict: any}> = ({dict}): JSX.Element => {
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
  } = useReviewer();

  return (
    <div className="space-y-3">
      <div className="border border-black p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="text-base">{dict?.account?.reviewer?.profile}</div>
          <button
            onClick={() => router.push(`/reviewer/${address}`)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {dict?.account?.reviewer?.viewProfilePage}
          </button>
        </div>
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">{dict?.account?.reviewer?.title}</label>
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
              <label className="block text-xs mb-1">{dict?.account?.reviewer?.image}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || "",
                  }))
                }
                className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">
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
            className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateLoading ? dict?.account?.reviewer?.updating : dict?.account?.reviewer?.update}
          </button>
        </form>
      </div>

      <div className="border border-black p-3">
        <div className="text-base mb-3">{dict?.account?.reviewer?.statistics}</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {context?.reviewer?.reviewCount}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.reviewer?.reviews}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {context?.reviewer?.totalScore}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.reviewer?.totalScore}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {context?.reviewer?.averageScore}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.reviewer?.avgScore}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {new Date(
                Number(context?.reviewer?.lastReviewTimestamp) * 1000
              ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.reviewer?.lastReview}</div>
          </div>
        </div>
      </div>

      <div className="border border-black p-3">
        <div className="text-base mb-3">{dict?.account?.reviewer?.recentReviews}</div>
        <div id="reviews-scroll" className="h-64 overflow-auto border border-gray-300">
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
                  className="border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/conductor/${review.conductorId}`)
                  }
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs">
                      {dict?.account?.reviewer?.review} #{review.reviewId}
                    </span>
                    <span className="text-xs text-gray-600">
                      {dict?.account?.reviewer?.score}: {review.reviewScore}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {dict?.account?.reviewer?.conductor}: #{review.conductorId}
                  </div>
                  <div className="text-xs text-gray-700 line-clamp-2 mb-1">
                    {review.metadata?.comment}
                  </div>
                  <div className="flex gap-1">
                    {review.metadata?.reactions?.map((reaction, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 px-1 py-0.5 rounded"
                      >
                        {reaction.emoji} {reaction.count}
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
