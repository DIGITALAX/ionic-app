import { ABIS } from "@/abis";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const useMint = (dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [minter, setMinter] = useState<boolean>(false);
  const [minted, setMinted] = useState<number>(0);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleMint = async () => {
    if (!address || !publicClient || !walletClient || minted) return;
    if (!minter) {
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
    } catch (err: any) {
      console.error(err.message);
    }
    setMintLoading(false);
  };

  const canMint = async () => {
    if (!address || !publicClient || minter || minted) return;
    try {
      const balanceOf = await publicClient.readContract({
        address: contracts.ionic,
        abi: ABIS.IonicNFT,
        functionName: "balanceOf",
        args: [address],
        account: address,
      });
      if (Number(balanceOf) > 0) {
        setMinted(Number(balanceOf));
        return;
      }
      const auth = await publicClient.readContract({
        address: contracts.ionic,
        abi: ABIS.IonicNFT,
        functionName: "isAuthorizedMinter",
        args: [address],
        account: address,
      });
      setMinter(Boolean(auth));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (address && publicClient && walletClient && !minter && !minted) {
      canMint();
    }
  }, [address, publicClient, walletClient]);

  return {
    mintLoading,
    handleMint,
    minted,
  };
};

export default useMint;
