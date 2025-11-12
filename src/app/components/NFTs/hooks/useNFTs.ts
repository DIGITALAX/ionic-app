import { useContext, useEffect, useState } from "react";
import { NFT } from "../../Common/types/common.types";
import { getAllNFTs } from "@/app/lib/queries/subgraph/getNFTs";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { TokenType } from "../types/nfts.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { ModalContext } from "@/app/providers";
import { fetchMetadata } from "@/app/lib/utils";

const useNFTs = (dict: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [nftsLoading, setNftsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState<boolean>(false);
  const [showTokenTypeDropdown, setShowTokenTypeDropdown] =
    useState<boolean>(false);
  const [hasMoreNfts, setHasMoreNfts] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    tokenId: number;
    tokenAddress: string;
    tokenType: TokenType;
  }>({
    tokenId: 0,
    tokenAddress: "0x",
    tokenType: TokenType.ERC721,
  });
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleSubmitNFT = async () => {
    if (!address || !publicClient || !walletClient) return;
    setSubmitLoading(true);
    try {
      await verifyNFT();
      const hash = await walletClient.writeContract({
        address: contracts.appraisals,
        abi: ABIS.IonicAppraisals,
        functionName: "submitNFT",
        args: [
          BigInt(formData.tokenId),
          formData.tokenAddress,
          formData.tokenType,
        ],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });

      setFormData({
        tokenId: 0,
        tokenAddress: "0x",
        tokenType: TokenType.ERC721,
      });
      setShowTokenTypeDropdown(false);
      setShowSubmitForm(false);

      context?.showSuccess(dict?.modals?.nft?.nftSubmitted, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.nft?.submitError);
    }
    setSubmitLoading(false);
  };

  const getNFTs = async (skip: number = 0, reset: boolean = false) => {
    if (!publicClient) return;
    setNftsLoading(true);
    try {
      const limit = 20;
      const data = await getAllNFTs(limit, skip);
      let newNfts = data?.data?.nfts;

      newNfts = await fetchMetadata(newNfts, publicClient);

      if (reset) {
        setNfts(newNfts);
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
      getNFTs(nfts.length, false);
    }
  };

  const verifyNFT = async () => {
    if (!publicClient || !formData.tokenAddress || !formData.tokenId)
      return false;

    try {
      if (
        formData.tokenType === TokenType.ERC721 ||
        formData.tokenType === TokenType.ERC998
      ) {
        const owner = await publicClient.readContract({
          address: formData.tokenAddress as `0x${string}`,
          abi: [
            {
              name: "ownerOf",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "tokenId", type: "uint256" }],
              outputs: [{ name: "owner", type: "address" }],
            },
          ],
          functionName: "ownerOf",
          args: [BigInt(formData.tokenId)],
        });
        return !!owner;
      } else if (formData.tokenType === TokenType.ERC1155) {
        const uri = await publicClient.readContract({
          address: formData.tokenAddress as `0x${string}`,
          abi: [
            {
              name: "uri",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "id", type: "uint256" }],
              outputs: [{ name: "uri", type: "string" }],
            },
          ],
          functionName: "uri",
          args: [BigInt(formData.tokenId)],
        });
        return !!uri;
      }
      return false;
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };

  useEffect(() => {
    if (!nftsLoading && nfts?.length < 1 && publicClient) {
      getNFTs(0, true);
    }
  }, [publicClient]);

  return {
    nftsLoading,
    nfts,
    hasMoreNfts,
    loadMoreNfts,
    handleSubmitNFT,
    submitLoading,
    formData,
    setFormData,
    showSubmitForm,
    setShowSubmitForm,
    showTokenTypeDropdown,
    setShowTokenTypeDropdown,
  };
};

export default useNFTs;
