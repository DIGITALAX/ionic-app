import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Appraisal } from "../../Common/types/common.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
  INFURA_GATEWAY,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { getConductorAppraisals } from "@/app/lib/queries/subgraph/getAppraisals";
import { fetchMetadata } from "@/app/lib/utils";

const useConductor = (dict: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [conductorLoading, setConductorLoading] = useState<boolean>(false);
  const [deactiveDesignerLoading, setDeactiveDesignerLoading] = useState<
    boolean[]
  >(
    Array.from(
      { length: context?.conductor?.invitedDesigners?.length || 0 },
      () => false
    )
  );
  const [inviteDesignerLoading, setInviteDesignerLoading] =
    useState<boolean>(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    image: string | File;
  }>(
    context?.conductor?.metadata || {
      title: "",
      description: "",
      image: "",
    }
  );
  const [inviteWallet, setInviteWallet] = useState<string>("");
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [appraisalsLoading, setAppraisalsLoading] = useState<boolean>(false);
  const [hasMoreAppraisals, setHasMoreAppraisals] = useState<boolean>(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleAllAppraisals = async (
    skip: number = 0,
    reset: boolean = false
  ) => {
    if (appraisalsLoading || !publicClient) return;

    setAppraisalsLoading(true);
    try {
      const limit = 20;
      const data = await getConductorAppraisals(
        Number(context?.conductor?.conductorId),
        limit,
        skip
      );
      let newAppraisals = data?.data?.appraisals || [];
      const nfts = await fetchMetadata(
        newAppraisals?.map((ap: any) => ({
          nftContract: ap?.nftContract,
          nftId: ap?.nftId,
          tokenType: ap?.tokenType,
        })),
        publicClient
      );
      newAppraisals = newAppraisals?.map((ap: any) => ({
        ...ap,
        nft: nfts?.find(
          (nft) =>
            Number(nft?.nftId) == Number(ap?.nftId) &&
            nft?.nftContract == ap?.nftContract
        ),
      }));
      if (reset) {
        setAppraisals(newAppraisals);
      } else {
        setAppraisals((prev) => [...prev, ...newAppraisals]);
      }

      setHasMoreAppraisals(newAppraisals.length === limit);
    } catch (err: any) {
      console.error(err.message);
    }
    setAppraisalsLoading(false);
  };

  const loadMoreAppraisals = () => {
    if (hasMoreAppraisals && !appraisalsLoading && publicClient) {
      handleAllAppraisals(appraisals.length, false);
    }
  };

  const handleConductor = async () => {
    if (
      !address ||
      !publicClient ||
      !context?.verified ||
      form.title.trim() == "" ||
      form.description.trim() == "" ||
      !walletClient
    )
      return;

    setConductorLoading(true);

    try {
      let image = form.image;
      if (typeof image !== "string") {
        const formData = new FormData();
        formData.append("file", image as File);

        const responseImage = await fetch("/api/ipfs", {
          method: "POST",
          body: formData,
        });

        const resImage = await responseImage.json();
        image = "ipfs://" + resImage.hash;
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          image,
          description: form.description,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.conductors,
        abi: ABIS.IonicConductors,
        functionName: "updateProfile",
        args: [
          Number(context?.conductor?.conductorId),
          "ipfs://" + result.hash,
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor((prev) => ({
        ...prev!,
        metadata: {
          title: form.title,
          image,
          description: form.description,
        },
      }));

      const message =
        Number(context?.conductor?.conductorId) > 0 && context?.conductor?.uri
          ? dict?.modals?.conductor?.profileUpdated
          : dict?.modals?.conductor?.profileCreated;

      context?.showSuccess(message, hash);
    } catch (err: any) {
      console.error(err.message);
      const errorMessage =
        Number(context?.conductor?.conductorId) > 0 && context?.conductor?.uri
          ? dict?.modals?.conductor?.updateError
          : dict?.modals?.conductor?.createError;

      context?.showError(errorMessage);
    }

    setConductorLoading(false);
  };

  const deleteProfile = async () => {
    if (
      !address ||
      !publicClient ||
      !context?.verified ||
      Number(context?.conductor?.conductorId) < 1 ||
      !walletClient
    )
      return;

    setDeleteLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: contracts.conductors,
        abi: ABIS.IonicConductors,
        functionName: "deleteProfile",
        args: [Number(context?.conductor?.conductorId)],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor(undefined);

      context?.showSuccess(dict?.modals?.conductor?.profileDeleted, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.conductor?.deleteError);
    }

    setDeleteLoading(false);
  };

  const handleInviteDesigner = async (designer: string) => {
    if (
      !address ||
      !publicClient ||
      Number(context?.verified?.minted) < 1 ||
      Number(context?.conductor?.conductorId) < 1 ||
      !walletClient
    )
      return;
    setInviteDesignerLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: contracts.designers,
        abi: ABIS.IonicDesigners,
        functionName: "inviteDesigner",
        args: [BigInt(Number(context?.conductor?.conductorId)), designer],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor(undefined);
      setInviteWallet("");
      context?.showSuccess(dict?.modals?.conductor?.designerInvited, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.conductor?.inviteError);
    }

    setInviteDesignerLoading(false);
  };

  const handleDeactiveDesigner = async (designerId: number, index: number) => {
    if (
      !address ||
      !publicClient ||
      !context?.verified ||
      Number(context?.conductor?.conductorId) < 1 ||
      !walletClient
    )
      return;

    setDeactiveDesignerLoading((prev) => {
      let arr = [...prev];
      arr[index] = true;

      return arr;
    });

    try {
      const hash = await walletClient.writeContract({
        address: contracts.designers,
        abi: ABIS.IonicDesigners,
        functionName: "deactivateDesigner",
        args: [BigInt(designerId)],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor(undefined);

      context?.showSuccess(dict?.modals?.conductor?.designerDeactivated, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.conductor?.deactivateError);
    }

    setDeactiveDesignerLoading((prev) => {
      let arr = [...prev];
      arr[index] = false;

      return arr;
    });
  };

  useEffect(() => {
    if (
      address &&
      appraisals.length < 1 &&
      Number(context?.conductor?.conductorId) > 0 &&
      publicClient
    ) {
      handleAllAppraisals(0, true);
    }
  }, [address, publicClient, context?.conductor]);

  useEffect(() => {
    if (form.image && typeof form.image !== "string") {
      const preview = URL.createObjectURL(form.image as Blob);
      setImagePreview(preview);
      return () => URL.revokeObjectURL(preview);
    } else if (!form.image.includes("ipfs://")) {
      setImagePreview("");
    }
  }, [form.image]);

  useEffect(() => {
    if (context?.conductor) {
      setForm({
        title: context?.conductor?.metadata?.title ?? "",
        description: context?.conductor?.metadata?.description ?? "",
        image: context?.conductor?.metadata?.image ?? "",
      });
      if (
        context?.conductor?.metadata?.image &&
        context?.conductor?.metadata?.image !== ""
      ) {
        setImagePreview(
          `${INFURA_GATEWAY}/ipfs/${
            context?.conductor?.metadata?.image?.split("ipfs://")?.[1]
          }`
        );
      }
    }
  }, [context?.conductor]);

  return {
    conductorLoading,
    handleConductor,
    form,
    setForm,
    deleteLoading,
    deleteProfile,
    appraisals,
    appraisalsLoading,
    hasMoreAppraisals,
    loadMoreAppraisals,
    handleInviteDesigner,
    inviteDesignerLoading,
    deactiveDesignerLoading,
    handleDeactiveDesigner,
    inviteWallet,
    setInviteWallet,
    imagePreview,
    setImagePreview,
  };
};

export default useConductor;
