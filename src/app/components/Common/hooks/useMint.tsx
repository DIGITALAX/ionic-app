import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const useMint = (dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const router = useRouter();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleMint = async () => {
    if (
      !address ||
      !publicClient ||
      !walletClient ||
      Number(context?.verified?.minted) > 0
    )
      return;
    if (!context?.verified?.canMint) {
      context?.showError(dict?.noMint);
      return;
    }
    setMintLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.ionic,
        abi: ABIS.IonicNFT,
        functionName: "mint",
        args: [],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.mintSuccess, hash);
      context?.setVerified({
        canMint: true,
        minted: 1,
      });
      router.push("/account");
    } catch (err: any) {
      console.error(err.message);
    }
    setMintLoading(false);
  };

  return {
    mintLoading,
    handleMint,
  };
};

export default useMint;
