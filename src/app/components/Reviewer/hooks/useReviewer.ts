import { useEffect, useState } from "react";
import { Reviewer } from "../../Common/types/common.types";
import { getReviewerPage } from "@/app/lib/queries/subgraph/getReviewers";
import { ensureMetadata } from "@/app/lib/utils";

const useReviewer = (reviewerAddress: string | undefined) => {
  const [reviewerLoading, setReviewerLoading] = useState<boolean>(false);
  const [reviewer, setReviewer] = useState<Reviewer | undefined>();

  const getPageReviewer = async () => {
    if (!reviewerAddress) return;
    setReviewerLoading(true);
    try {
      const data = await getReviewerPage(reviewerAddress);
      const ensured = await ensureMetadata(data?.data?.reviewers?.[0]);
      setReviewer(ensured);
    } catch (err: any) {
      console.error(err.message);
    }
    setReviewerLoading(false);
  };

  useEffect(() => {
    if (reviewerAddress) {
      getPageReviewer();
    }
  }, [reviewerAddress]);

  return {
    reviewerLoading,
    reviewer,
  };
};

export default useReviewer;
