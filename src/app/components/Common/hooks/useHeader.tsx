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
import { ABIS } from "@/abis";
import { ensureMetadata } from "@/app/lib/utils";

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
      const conductorId = (await publicClient.readContract({
        address: contracts.ionic,
        abi: ABIS.IonicNFT,
        functionName: "balanceOf",
        args: [address],
        account: address,
      })) as bigint;

      const data = await getConductor(Number(conductorId));
      let ensured = data?.data?.conductors?.[0];
      if (ensured?.uri && !ensured?.metadata) {
        ensured = await ensureMetadata(ensured);
      }
      const invitedDesigners = await Promise.all(
        (ensured?.invitedDesigners ?? [])?.map(async (des: any) => {
          if (des?.uri && !des?.metadata) {
            des = await ensureMetadata(des);
          }
          return des;
        })
      );
      context?.setConductor({
        ...ensured,
        invitedDesigners,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setConductorLoading(false);
  };

  const getUserReactions = async () => {
    if (!publicClient || !address) return;
    try {
      const balance = (await publicClient.readContract({
        address: contracts.reactionPacks,
        abi: ABIS.IonicReactionPacks,
        functionName: "balanceOf",
        args: [address],
        account: address,
      })) as bigint;

      const tokenIds: number[] = [];
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await publicClient.readContract({
          address: contracts.reactionPacks,
          abi: ABIS.IonicReactionPacks,
          functionName: "tokenOfOwnerByIndex",
          args: [address, BigInt(i)],
          account: address,
        });
        tokenIds.push(Number(tokenId));
      }

      const data = await getTokenReactions(tokenIds);

      if (data?.data?.tokenReactions) {
        const reactionMap = new Map();

        data?.data?.tokenReactions
          ?.map((item: any) => item?.reaction)
          .forEach((reaction: Reaction) => {
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
    if (
      !address ||
      !publicClient ||
      context?.verified?.canMint ||
      Number(context?.verified?.minted) > 0
    )
      return;
    try {
      const balanceOf = await publicClient.readContract({
        address: contracts.ionic,
        abi: ABIS.IonicNFT,
        functionName: "balanceOf",
        args: [address],
        account: address,
      });
      if (Number(balanceOf) > 0) {
        context?.setVerified((prev) => ({
          ...prev,
          minted: Number(balanceOf),
        }));
        return;
      }
      const auth = await publicClient.readContract({
        address: contracts.ionic,
        abi: ABIS.IonicNFT,
        functionName: "isAuthorizedMinter",
        args: [address],
        account: address,
      });
      context?.setVerified((prev) => ({
        ...prev,
        canMint: Boolean(auth),
      }));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (address && !context?.conductor && publicClient) {
      getConductorAccount();
    }

    if (
      address &&
      publicClient &&
      !context?.verified?.canMint &&
      Number(context?.verified?.minted) == 0
    ) {
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
