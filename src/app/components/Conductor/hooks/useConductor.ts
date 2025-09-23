import { getConductorPage } from "@/app/lib/queries/subgraph/getConductors";
import { useContext, useEffect, useState } from "react";
import { Conductor, FloatingEmoji } from "../../Common/types/common.types";
import { DUMMY_CONDUCTOR } from "@/app/lib/dummy";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ABIS } from "@/abis";
import { ReviewData } from "../types/conductor.types";
import { ModalContext } from "@/app/providers";

const useConductor = (conductorAddress: string | undefined, dict?: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [conductorLoading, setConductorLoading] = useState<boolean>(false);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [conductor, setConductor] = useState<Conductor | undefined>();
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ReviewData>({
    comment: "",
    reviewScore: 50,
    reactions: [],
    conductorId: Number(conductor?.conductorId) || 0,
    reactionUsage: [],
  });
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showEmojiPanel, setShowEmojiPanel] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleEmojiClick = (emoji: string, x: number, y: number) => {
    const floatingId = Date.now() + Math.random().toString();

    setReviewData((prev) => {
      const existingReaction = prev.reactions.find((r) => r.emoji === emoji);

      const updatedAppraisal = {
        ...prev,
        reactions: existingReaction
          ? prev.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          : [...prev.reactions, { emoji, count: 1 }],
      };

      return updatedAppraisal;
    });

    setFloatingEmojis((prev) => [
      ...prev,
      {
        id: floatingId,
        emoji,
        x,
        y,
      },
    ]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((fe) => fe.id !== floatingId));
    }, 1000);
  };

  const handleCustomReactionClick = (
    reactionId: string,
    displayValue: string,
    x: number,
    y: number,
    maxCount: number
  ) => {
    const floatingId = Date.now() + Math.random().toString();

    setReviewData((prev) => {
      const existingUsage = prev.reactionUsage.find(
        (r) => r.reactionId === Number(reactionId)
      );
      const currentCount = existingUsage ? existingUsage.count : 0;

      if (currentCount >= maxCount) {
        return prev;
      }

      const updatedAppraisal = {
        ...prev,
        reactionUsage: existingUsage
          ? prev.reactionUsage.map((r) =>
              r.reactionId === Number(reactionId)
                ? { ...r, count: r.count + 1 }
                : r
            )
          : [
              ...prev.reactionUsage,
              { reactionId: Number(reactionId), count: 1 },
            ],
      };

      return updatedAppraisal;
    });

    setFloatingEmojis((prev) => [
      ...prev,
      {
        id: floatingId,
        emoji: displayValue,
        x,
        y,
      },
    ]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((fe) => fe.id !== floatingId));
    }, 1000);
  };

  const decreaseEmoji = (emoji: string) => {
    setReviewData((prev) => {
      const updatedReactions = prev.reactions
        .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1 } : r))
        .filter((r) => r.count > 0);

      const updatedAppraisal = {
        ...prev,
        reactions: updatedReactions,
      };

      return updatedAppraisal;
    });
  };

  const decreaseCustomReaction = (reactionId: string) => {
    setReviewData((prev) => {
      const updatedReactionUsage = prev.reactionUsage
        .map((r) =>
          r.reactionId === Number(reactionId) ? { ...r, count: r.count - 1 } : r
        )
        .filter((r) => r.count > 0);

      const updatedAppraisal = {
        ...prev,
        reactionUsage: updatedReactionUsage,
      };

      return updatedAppraisal;
    });
  };

  const updateComment = (comment: string) => {
    setReviewData((prev) => {
      const updatedAppraisal = {
        ...prev,
        comment,
      };

      return updatedAppraisal;
    });
  };

  const updateScore = (score: number) => {
    setReviewData((prev) => {
      const updatedAppraisal = {
        ...prev,
        reviewScore: score,
      };

      return updatedAppraisal;
    });
  };

  const getPageConductor = async () => {
    if (!conductorAddress) return;
    setConductorLoading(true);
    try {
      const data = await getConductorPage(conductorAddress);

      setConductor(data?.data?.conductors?.[0] ?? DUMMY_CONDUCTOR);
    } catch (err: any) {
      console.error(err.message);
    }
    setConductorLoading(false);
  };

  const handleReview = async () => {
    if (
      !walletClient ||
      !address ||
      !publicClient ||
      !conductor ||
      reviewData.comment.trim() == ""
    )
      return;
    setReviewLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: reviewData.comment,
          reactions: reviewData.reactions,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.conductors,
        abi: ABIS.IonicConductors,
        functionName: "submitReview",
        args: [
          Number(conductor?.conductorId),
          Number(reviewData?.reviewScore),
          "ipfs://" + result.hash,
          reviewData.reactionUsage,
        ],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      
      setReviewSuccess(true);
      context?.showSuccess(
        dict?.modals?.conductor?.reviewSubmitted,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.conductor?.reviewError
      );
    }
    setReviewLoading(false);
  };

  const handleEmojiButtonClick = (emoji: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    handleEmojiClick(
      emoji,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  };

  useEffect(() => {
    if (conductorAddress) {
      getPageConductor();
    }
  }, [conductorAddress]);

  useEffect(() => {
    if (reviewSuccess) {
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    }
  }, [reviewSuccess]);

  return {
    conductorLoading,
    conductor,
    handleReview,
    reviewLoading,
    reviewSuccess,
    reviewData,
    setReviewData,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
  };
};

export default useConductor;
