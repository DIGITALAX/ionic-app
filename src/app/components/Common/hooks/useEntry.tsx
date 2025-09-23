import { useContext, useEffect, useState } from "react";
import {
  AppraisalData,
  NFT,
  FloatingEmoji,
  ReactionUsage,
} from "../types/common.types";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { ModalContext } from "@/app/providers";
import {
  getAllNFTs,
  getNotAppraisedNFTs,
} from "@/app/lib/queries/subgraph/getNFTs";
import { DUMMY_NFTS } from "@/app/lib/dummy";
import { fetchNFTMetadata } from "@/app/lib/helpers/metadata";

const useEntry = (dict?: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState<boolean>(false);
  const [hasMoreNfts, setHasMoreNfts] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [appraisalLoading, setAppraisalLoading] = useState<boolean>(false);
  const [appraisalSuccess, setAppraisalSuccess] = useState<boolean>(false);
  const [appraisalData, setAppraisalData] = useState<AppraisalData[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showEmojiPanel, setShowEmojiPanel] = useState<boolean>(false);

  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const currentNFT = nfts[currentIndex];

  const getNfts = async (reset: boolean = false) => {
    if (nftsLoading) return;

    setNftsLoading(true);
    try {
      const skip = reset ? 0 : nfts.length;
      const limit = 20;
      let newNfts: NFT[] = [];

      if (address) {
        const data = await getNotAppraisedNFTs(address, limit, skip);
        newNfts = data?.data?.conductors?.[0]?.notAppraised || [];
      } else {
        const data = await getAllNFTs(limit, skip);
        newNfts = data?.data?.nfts || [];
      }

      if (newNfts.length < 1) {
        newNfts = DUMMY_NFTS;
      } else if (publicClient) {
        const nftsWithMetadata = await Promise.all(
          newNfts.map(async (nft) => {
            try {
              const tokenURI = await publicClient.readContract({
                address: nft.nftContract as `0x${string}`,
                abi: [
                  {
                    type: "function",
                    name: "tokenURI",
                    inputs: [
                      {
                        name: "tokenId",
                        type: "uint256",
                        internalType: "uint256",
                      },
                    ],
                    outputs: [
                      { name: "", type: "string", internalType: "string" },
                    ],
                    stateMutability: "view",
                  },
                ],
                functionName: "tokenURI",
                args: [BigInt(nft.tokenId)],
                account: address,
              });

              if (tokenURI) {
                const metadata = await fetchNFTMetadata(tokenURI as string);
                if (metadata) {
                  return { ...nft, metadata };
                }
              }
            } catch (error) {
              console.error(
                `Error fetching metadata for NFT ${nft.nftId}:`,
                error
              );
            }
            return nft;
          })
        );
        newNfts = nftsWithMetadata;
      }

      if (reset) {
        setNfts(newNfts);
        setCurrentIndex(0);
      } else {
        setNfts((prev) => [...prev, ...newNfts]);
      }

      setHasMoreNfts(newNfts.length === limit);
    } catch (err: any) {
      console.error(err.message);
    }
    setNftsLoading(false);
  };

  const loadMoreNfts = () => {
    if (hasMoreNfts && !nftsLoading) {
      getNfts(false);
    }
  };

  const nextNFT = () => {
    if (currentIndex < nfts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (hasMoreNfts && currentIndex === nfts.length - 1) {
      loadMoreNfts();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousNFT = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleEmojiClick = (emoji: string, x: number, y: number) => {
    const floatingId = Date.now() + Math.random().toString();

    setAppraisalData((prev) => {
      const currentAppraisalIndex = prev.findIndex(
        (ap) => Number(ap.nftId) === Number(currentNFT.nftId)
      );

      if (currentAppraisalIndex !== -1) {
        const currentAppraisal = prev[currentAppraisalIndex];
        const existingReaction = currentAppraisal.reactions.find(
          (r) => r.emoji === emoji
        );

        const updatedAppraisal = {
          ...currentAppraisal,
          reactions: existingReaction
            ? currentAppraisal.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              )
            : [...currentAppraisal.reactions, { emoji, count: 1 }],
        };

        return prev.map((ap, index) =>
          index === currentAppraisalIndex ? updatedAppraisal : ap
        );
      } else {
        return [
          ...prev,
          {
            nftId: Number(currentNFT.nftId),
            nftContract: currentNFT.nftContract,
            reactionUsage: [],
            overallScore: 50,
            comment: "",
            reactions: [{ emoji, count: 1 }],
          },
        ];
      }
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
      const currentAppraisalIndex = prev.findIndex(
        (ap) => Number(ap.nftId) === Number(currentNFT.nftId)
      );

      if (currentAppraisalIndex !== -1) {
        const currentAppraisal = prev[currentAppraisalIndex];
        const existingUsage = currentAppraisal.reactionUsage.find(
          (r) => r.reactionId === Number(reactionId)
        );
        const currentCount = existingUsage ? existingUsage.count : 0;

        if (currentCount >= maxCount) {
          return prev;
        }

        const updatedAppraisal = {
          ...currentAppraisal,
          reactionUsage: existingUsage
            ? currentAppraisal.reactionUsage.map((r) =>
                r.reactionId === Number(reactionId)
                  ? { ...r, count: r.count + 1 }
                  : r
              )
            : [
                ...currentAppraisal.reactionUsage,
                { reactionId: Number(reactionId), count: 1 },
              ],
        };

        return prev.map((ap, index) =>
          index === currentAppraisalIndex ? updatedAppraisal : ap
        );
      } else {
        return [
          ...prev,
          {
            nftId: Number(currentNFT.nftId),
            nftContract: currentNFT.nftContract,
            reactionUsage: [{ reactionId: Number(reactionId), count: 1 }],
            overallScore: 50,
            comment: "",
            reactions: [],
          },
        ];
      }
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
      const currentAppraisalIndex = prev.findIndex(
        (ap) => Number(ap.nftId) === Number(currentNFT.nftId)
      );

      if (currentAppraisalIndex !== -1) {
        const currentAppraisal = prev[currentAppraisalIndex];
        const updatedReactions = currentAppraisal.reactions
          .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1 } : r))
          .filter((r) => r.count > 0);

        const updatedAppraisal = {
          ...currentAppraisal,
          reactions: updatedReactions,
        };

        return prev.map((ap, index) =>
          index === currentAppraisalIndex ? updatedAppraisal : ap
        );
      }
      return prev;
    });
  };

  const decreaseCustomReaction = (reactionId: string) => {
    setAppraisalData((prev) => {
      const currentAppraisalIndex = prev.findIndex(
        (ap) => Number(ap.nftId) === Number(currentNFT.nftId)
      );

      if (currentAppraisalIndex !== -1) {
        const currentAppraisal = prev[currentAppraisalIndex];
        const updatedReactionUsage = currentAppraisal.reactionUsage
          .map((r) =>
            r.reactionId === Number(reactionId)
              ? { ...r, count: r.count - 1 }
              : r
          )
          .filter((r) => r.count > 0);

        const updatedAppraisal = {
          ...currentAppraisal,
          reactionUsage: updatedReactionUsage,
        };

        return prev.map((ap, index) =>
          index === currentAppraisalIndex ? updatedAppraisal : ap
        );
      }
      return prev;
    });
  };

  const updateComment = (comment: string) => {
    setAppraisalData((prev) => {
      const currentAppraisalIndex = prev.findIndex(
        (ap) => Number(ap.nftId) === Number(currentNFT.nftId)
      );

      if (currentAppraisalIndex !== -1) {
        const updatedAppraisal = {
          ...prev[currentAppraisalIndex],
          comment,
        };

        return prev.map((ap, index) =>
          index === currentAppraisalIndex ? updatedAppraisal : ap
        );
      } else {
        return [
          ...prev,
          {
            nftId: Number(currentNFT.nftId),
            nftContract: currentNFT.nftContract,
            reactionUsage: [],
            overallScore: 50,
            comment,
            reactions: [],
          },
        ];
      }
    });
  };

  const updateScore = (score: number) => {
    setAppraisalData((prev) => {
      const currentAppraisalIndex = prev.findIndex(
        (ap) => Number(ap.nftId) === Number(currentNFT.nftId)
      );

      if (currentAppraisalIndex !== -1) {
        const updatedAppraisal = {
          ...prev[currentAppraisalIndex],
          overallScore: score,
        };

        return prev.map((ap, index) =>
          index === currentAppraisalIndex ? updatedAppraisal : ap
        );
      } else {
        return [
          ...prev,
          {
            nftId: Number(currentNFT.nftId),
            nftContract: currentNFT.nftContract,
            reactionUsage: [],
            overallScore: score,
            comment: "",
            reactions: [],
          },
        ];
      }
    });
  };

  const handleAppraisal = async () => {
    const currentAppraisal = appraisalData.find(
      (ap) => Number(ap.nftId) == Number(currentNFT.nftId)
    );
    if (
      !walletClient ||
      !publicClient ||
      !address ||
      !context?.conductor ||
      !currentAppraisal?.comment ||
      currentAppraisal.reactions.length === 0 ||
      !context?.verified
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
          comment: currentAppraisal.comment,
          reactions: currentAppraisal.reactions,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.appraisals,
        abi: ABIS.IonicAppraisals,
        functionName: "createAppraisal",
        args: [
          Number(currentAppraisal?.nftId),
          Number(context?.conductor?.conductorId),
          currentAppraisal.overallScore,
          "ipfs://" + result.hash,
          currentAppraisal.reactionUsage,
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setAppraisalSuccess(true);
      setAppraisalData((prev) => {
        let arr = [...prev];
        return arr.filter((arr) => arr.nftId !== currentAppraisal.nftId);
      });
      
      context?.showSuccess(
        dict?.modals?.entry?.appraisalSubmitted,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.entry?.appraisalError
      );
    }
    setAppraisalLoading(false);
  };

  const handleAppraisalBatch = async () => {
    if (
      !walletClient ||
      !publicClient ||
      !address ||
      !context?.conductor ||
      !appraisalData.every((ap) => ap.comment) ||
      !appraisalData.every((ap) => ap.reactions.length > 0) ||
      !context?.verified
    )
      return;

    setAppraisalLoading(true);
    try {
      let data: {
        uri: string;
        nftId: number;
        nftContract: string;
        overallScore: number;
        reactionUsage: ReactionUsage[];
      }[] = [];
      await Promise.all(
        appraisalData.map(async (app) => {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              comment: app.comment,
              reactions: app.reactions,
            }),
          });

          const result = await response.json();
          data.push({
            uri: "ipfs://" + result.hash,
            nftId: Number(app.nftId),
            nftContract: app.nftContract,
            overallScore: Number(app.overallScore),
            reactionUsage: app.reactionUsage,
          });
        })
      );

      const hash = await walletClient.writeContract({
        address: contracts.appraisals,
        abi: ABIS.IonicAppraisals,
        functionName: "createAppraisalBatch",
        args: [
          Number(context?.conductor?.conductorId),
          data.map((d) => d.nftId),
          data.map((d) => d.overallScore),
          data.map((d) => d.uri),
          data.map((d) => d.reactionUsage),
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setAppraisalSuccess(true);
      setAppraisalData([]);
      
      context?.showSuccess(
        dict?.modals?.entry?.batchAppraisalsSubmitted,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.entry?.batchAppraisalsError
      );
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

  useEffect(() => {
    if (nfts.length < 1 && !nftsLoading) {
      getNfts(true);
    }
  }, [address]);

  useEffect(() => {
    if (appraisalSuccess) {
      setTimeout(() => {
        setAppraisalSuccess(false);
      }, 3000);
    }
  }, [appraisalSuccess]);

  const currentAppraisal = appraisalData.find(
    (ap) => Number(ap.nftId) === Number(currentNFT?.nftId)
  );

  return {
    nfts,
    nftsLoading,
    hasMoreNfts,
    loadMoreNfts,
    currentNFT,
    nextNFT,
    previousNFT,
    handleAppraisal,
    appraisalLoading,
    appraisalSuccess,
    appraisalData,
    currentAppraisal,
    floatingEmojis,
    showEmojiPanel,
    setShowEmojiPanel,
    updateComment,
    updateScore,
    setAppraisalData,
    handleEmojiButtonClick,
    handleCustomReactionClick,
    decreaseEmoji,
    decreaseCustomReaction,
    handleAppraisalBatch,
  };
};

export default useEntry;
