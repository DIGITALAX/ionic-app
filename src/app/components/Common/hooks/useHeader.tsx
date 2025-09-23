import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import {
  getConductor,
  getTokenReactions,
} from "@/app/lib/queries/subgraph/getConductors";
import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Reaction } from "../types/common.types";

const useHeader = () => {
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const [conductorLoading, setConductorLoading] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const getConductorAccount = async () => {
    if (!address || !publicClient) return;
    setConductorLoading(true);
    try {
      const data = await getConductor(address);
      context?.setConductor(data?.data?.conductors?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
    setConductorLoading(false);
  };

  const getUserReactions = async () => {
    if (!publicClient || !address) return;
    try {
      const tokenIds = await publicClient.readContract({
        address: contracts.reactionPacks,
        abi: [
          {
            type: "function",
            name: "tokensOfOwner",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
            ],
            outputs: [
              { name: "", type: "uint256[]", internalType: "uint256[]" },
            ],
            stateMutability: "view",
          },
        ],
        functionName: "tokensOfOwner",
        args: [address],
        account: address,
      });

      const data = await getTokenReactions(tokenIds.map((tok) => Number(tok)));

      if (data?.data?.reactions) {
        const reactionMap = new Map();

        data.data.reactions.forEach((reaction: Reaction) => {
          const reactionId = reaction.reactionId;
          if (reactionMap.has(reactionId)) {
            reactionMap.get(reactionId).count++;
          } else {
            reactionMap.set(reactionId, {
              reaction: reaction,
              count: 1,
            });
          }
        });

        const groupedReactions = Array.from(reactionMap.values());
        context?.setUserReactions(groupedReactions);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getVerifiedConductor = async () => {
    if (!publicClient || !address) return;
    try {
      const data = await publicClient.readContract({
        address: contracts.ionic,
        abi: [
          {
            type: "function",
            name: "balanceOf",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "balanceOf",
        args: [address],
        account: address,
      });

      context?.setVerified(Number(data) > 0);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (address && !context?.conductor && publicClient) {
      getConductorAccount();
    }

    if (address && publicClient && !context?.verified) {
      getVerifiedConductor();
    }

    if (address && publicClient && Number(context?.userReactions) < 1) {
      getUserReactions();
    }
  }, [address, publicClient]);

  return {
    isConnected,
    conductorLoading,
  };
};

export default useHeader;
