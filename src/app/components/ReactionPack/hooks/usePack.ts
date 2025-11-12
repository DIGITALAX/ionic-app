import { useContext, useEffect, useState } from "react";
import { ReactionPack } from "../../Common/types/common.types";
import { getReactionPack } from "@/app/lib/queries/subgraph/getReactions";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { ModalContext } from "@/app/providers";

const usePack = (packId: number | undefined, dict: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [packLoading, setPackLoading] = useState<boolean>(false);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [hasAllowance, setHasAllowance] = useState<boolean>(false);
  const [isInReservedPhase, setIsInReservedPhase] = useState<boolean>(false);
  const [isConductor, setIsConductor] = useState<boolean>(false);
  const [pack, setPack] = useState<ReactionPack | undefined>();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const getPack = async () => {
    if (!packId) return;
    setPackLoading(true);
    try {
      const data = await getReactionPack(packId);
      setPack(data?.data?.reactionPacks?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
    setPackLoading(false);
  };

  const checkAllowance = async () => {
    if (!address || !publicClient || !pack) return;

    try {
      const currentPrice = BigInt(pack.currentPrice);

      const allowance = await publicClient.readContract({
        address: contracts.mona,
        abi: [
          {
            type: "function",
            name: "allowance",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
              { name: "spender", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "allowance",
        args: [address, contracts.reactionPacks],
      });

      setHasAllowance(allowance >= currentPrice);
    } catch (err: any) {
      console.error(err.message);
      setHasAllowance(false);
    }
  };

  const checkReservedPhase = () => {
    if (!pack) return;

    const soldCount = Number(pack.soldCount);
    const conductorReservedSpots = Number(pack.conductorReservedSpots);

    setIsInReservedPhase(soldCount < conductorReservedSpots);
    setIsConductor(Number(context?.conductor?.conductorId) > 0);
  };
  const handleApprove = async () => {
    if (!address || !publicClient || !walletClient || !pack) return;

    setApproveLoading(true);
    try {
      const currentPrice = BigInt(pack.currentPrice);

      const hash = await walletClient.writeContract({
        address: contracts.mona,
        abi: [
          {
            type: "function",
            name: "approve",
            inputs: [
              { name: "spender", type: "address", internalType: "address" },
              { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "approve",
        args: [contracts.reactionPacks, currentPrice],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await checkAllowance();
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.pack?.approveError || "Failed to approve");
    }
    setApproveLoading(false);
  };

  const handlePurchasePack = async () => {
    if (!address || !publicClient || !walletClient || !packId || !pack) return;

    setPurchaseLoading(true);
    try {
      const currentPrice = BigInt(pack.currentPrice);

      const monaBalance = await publicClient.readContract({
        address: contracts.mona,
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
      });

      if (monaBalance < currentPrice) {
        setPurchaseLoading(false);
        context?.showError(dict?.modals?.pack?.insufficientBalance);
        return;
      }

      const soldCount = Number(pack.soldCount);
      const conductorReservedSpots = Number(pack.conductorReservedSpots);

      if (soldCount < conductorReservedSpots && !isConductor) {
        setPurchaseLoading(false);
        context?.showError(dict?.modals?.pack?.conductorOnly);
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.reactionPacks,
        abi: ABIS.IonicReactionPacks,
        functionName: "purchaseReactionPack",
        args: [packId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await getPack();
      await checkAllowance();

      context?.showSuccess(dict?.modals?.pack?.purchaseSuccessful, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.pack?.purchaseError);
    }
    setPurchaseLoading(false);
  };

  useEffect(() => {
    if (packId) {
      getPack();
    }
  }, [packId]);

  useEffect(() => {
    if (pack && address && publicClient) {
      checkAllowance();
      checkReservedPhase();
    }
  }, [pack, address, publicClient, context?.conductor]);

  return {
    packLoading,
    pack,
    handlePurchasePack,
    purchaseLoading,
    handleApprove,
    approveLoading,
    hasAllowance,
    isInReservedPhase,
    isConductor,
  };
};

export default usePack;