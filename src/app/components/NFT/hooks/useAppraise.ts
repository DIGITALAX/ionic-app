import { useContext, useEffect, useState } from "react";
import { AppraisalData, FloatingEmoji } from "../../Common/types/common.types";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ModalContext } from "@/app/providers";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";

const useAppraise = (
  nftContract: string | undefined,
  nftId: number | undefined,
  dict: any
) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [appraisalLoading, setAppraisalLoading] = useState<boolean>(false);
  const [appraisalData, setAppraisalData] = useState<AppraisalData>({
    overallScore: 50,
    comment: "",
    reactions: [],
    nftId: nftId || 0,
    nftContract: nftContract || "",
    reactionUsage: [],
  });
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showEmojiPanel, setShowEmojiPanel] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleEmojiClick = (emoji: string, x: number, y: number) => {
    const floatingId = Date.now() + Math.random().toString();

    setAppraisalData((prev) => {
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

    setAppraisalData((prev) => {
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
    setAppraisalData((prev) => {
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
    setAppraisalData((prev) => {
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
    setAppraisalData((prev) => {
      const updatedAppraisal = {
        ...prev,
        comment,
      };

      return updatedAppraisal;
    });
  };

  const updateScore = (score: number) => {
    setAppraisalData((prev) => {
      const updatedAppraisal = {
        ...prev,
        overallScore: score,
      };

      return updatedAppraisal;
    });
  };

  const handleAppraisal = async () => {
    if (
      !walletClient ||
      !publicClient ||
      !address ||
      Number(context?.conductor?.conductorId) < 1 ||
      !appraisalData?.comment ||
      appraisalData.reactions.length === 0 ||
      Number(context?.verified?.minted) < 1 ||
      !nftContract ||
      !nftId
    )
      return;

    setAppraisalLoading(true);
    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: appraisalData.comment,
          reactions: appraisalData.reactions,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.appraisals,
        abi: ABIS.IonicAppraisals,
        functionName: "createAppraisal",
        args: [
          appraisalData?.nftContract,
          Number(appraisalData?.nftId),
          Number(context?.conductor?.conductorId),
          appraisalData.overallScore,
          "ipfs://" + result.hash,
          appraisalData.reactionUsage,
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setShowEmojiPanel(false);
      setAppraisalData({
        overallScore: 50,
        comment: "",
        reactionUsage: [],
        reactions: [],
        nftId,
        nftContract,
      });

      context?.showSuccess(dict?.modals?.entry?.appraisalSubmitted, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.entry?.appraisalError);
    }
    setAppraisalLoading(false);
  };

  const handleEmojiButtonClick = (emoji: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    handleEmojiClick(
      emoji,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  };

  return {
    handleAppraisal,
    appraisalData,
    setAppraisalData,
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
  };
};

export default useAppraise;
