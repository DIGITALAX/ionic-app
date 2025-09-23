import { useContext, useEffect, useState } from "react";
import { DUMMY_PACKS } from "@/app/lib/dummy";
import { ReactionPack } from "../../Common/types/common.types";
import { getReactionPack } from "@/app/lib/queries/subgraph/getReactions";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { formatUnits } from "viem";
import { ModalContext } from "@/app/providers";

const usePack = (packId: number | undefined, dict?: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [packLoading, setPackLoading] = useState<boolean>(false);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [pack, setPack] = useState<ReactionPack | undefined>();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const getPack = async () => {
    if (!packId) return;
    setPackLoading(true);
    try {
      const data = await getReactionPack(packId);

      setPack(data?.data?.reactionPacks?.[0] ?? DUMMY_PACKS[0]);
    } catch (err: any) {
      console.error(err.message);
    }
    setPackLoading(false);
  };

  const handlePurchasePack = async () => {
    if (!address || !publicClient || !walletClient || !packId || !pack) return;

    setPurchaseLoading(true);
    try {
      await checkEligible();

      const hash = await walletClient.writeContract({
        address: contracts.reactionPacks,
        abi: ABIS.IonicReactionPacks,
        functionName: "purchaseReactionPack",
        args: [packId],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await getPack();
      
      context?.showSuccess(
        dict?.modals?.pack?.purchaseSuccessful,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.pack?.purchaseError
      );
    }
    setPurchaseLoading(false);
  };

  const checkEligible = async () => {
    if (!address || !publicClient || !packId || !pack) return;

    try {
      const soldCount = Number(pack.soldCount);
      const conductorReservedSpots = Number(pack.conductorReservedSpots);
      const currentPrice = BigInt(pack.currentPrice);

      if (soldCount < conductorReservedSpots) {
        const conductorId = await publicClient.readContract({
          address: contracts.conductors,
          abi: ABIS.IonicConductors,
          functionName: "walletToConductor",
          args: [address],
        });

        if (!conductorId || conductorId === 0) {
          throw new Error("Only conductors can purchase during reserved phase");
        }
      }

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
        throw new Error(
          `Insufficient MONA balance. Required: ${currentPrice}, Available: ${monaBalance}`
        );
      }

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

      if (allowance < currentPrice) {
        if (!walletClient) throw new Error("Wallet client not available");

        const approveHash = await walletClient.writeContract({
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

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }
    } catch (err: any) {
      console.error(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (packId) {
      getPack();
    }
  }, [packId]);

  return {
    packLoading,
    pack,
    handlePurchasePack,
    purchaseLoading,
  };
};

export default usePack;
