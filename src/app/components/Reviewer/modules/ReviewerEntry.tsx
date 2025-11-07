"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX } from "react";
import useReviewer from "../hooks/useReviewer";
import Image from "next/image";

const ReviewerEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { reviewer: reviewerAddress } = useParams();
  const { reviewer, reviewerLoading } = useReviewer(reviewerAddress as string);
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

  if (reviewerLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="text-center">{dict?.reviewer?.loading}</div>
      </div>
    );
  }

  if (!reviewer) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="text-center">{dict?.reviewer?.notFound}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-3">
      <div className="border border-black p-3 mb-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {reviewer.metadata?.image && (
            <div className="w-full lg:w-48 h-48 relative border border-black shrink-0 mx-auto lg:mx-0">
              <Image
                fill
                src={reviewer.metadata.image}
                alt={reviewer.metadata.title}
                className="object-cover"
                draggable={false}
              />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-lg mb-1">
                {reviewer.metadata?.title || dict?.reviewer?.defaultTitle}
              </h1>
              <div className="text-sm text-gray-600">{formatAddress(reviewer.wallet)}</div>
            </div>

            {reviewer.metadata?.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{reviewer.metadata.description}</p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              <div className="border border-gray-300 p-2">
                <div className="text-sm">{reviewer.reviewCount}</div>
                <div className="text-gray-600">Reviews</div>
              </div>
              <div className="border border-gray-300 p-2">
                <div className="text-sm">{reviewer.averageScore}</div>
                <div className="text-gray-600">Avg Score</div>
              </div>
              <div className="border border-gray-300 p-2 col-span-2 lg:col-span-1">
                <div className="text-sm">{reviewer.totalScore}</div>
                <div className="text-gray-600">Total Given</div>
              </div>
            </div>

            <div className="text-xs">
              <div>Last Review: {formatDate(reviewer.lastReviewTimestamp)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-black border-t-0">
        <div className="p-3 border-b border-black bg-gray-50">
          <div className="text-base">{dict?.reviewer?.reviewsGiven} ({reviewer.reviewCount})</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {reviewer.reviews && reviewer.reviews.length > 0 ? (
            reviewer.reviews.map((review: any) => (
              <div key={review.reviewId} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-1 text-xs">#{review.reviewId}</span>
                    <span className="text-sm">{review.reviewScore}/100</span>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(review.timestamp)}</div>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  For: {review.conductor?.metadata?.title || formatAddress(review.conductor?.wallet)}
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
                  <button
                    onClick={() => router.push(`/conductor/${review.conductor?.conductorId}`)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {dict?.reviewer?.viewConductorProfile}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-gray-600">{dict?.reviewer?.noReviews}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerEntry;
