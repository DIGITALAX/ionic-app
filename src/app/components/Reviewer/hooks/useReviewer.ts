import { useEffect, useState } from "react";
import { Reviewer } from "../../Common/types/common.types";
import { getReviewerPage } from "@/app/lib/queries/subgraph/getReviewers";
import { DUMMY_REVIEWER } from "@/app/lib/dummy";

const useReviewer = (reviewerAddress: string | undefined) => {
  const [reviewerLoading, setReviewerLoading] = useState<boolean>(false);
  const [reviewer, setReviewer] = useState<Reviewer | undefined>();

  const getPageReviewer = async () => {
    if (!reviewerAddress) return;
    setReviewerLoading(true);
    try {
      const data = await getReviewerPage(reviewerAddress);

      setReviewer(data?.data?.reviewers?.[0] ?? DUMMY_REVIEWER);
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
