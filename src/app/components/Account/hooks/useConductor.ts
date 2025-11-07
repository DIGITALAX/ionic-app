import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Appraisal, BaseMetadata } from "../../Common/types/common.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import { getConductorAppraisals } from "@/app/lib/queries/subgraph/getAppraisals";

const useConductor = (dict?: any) => {
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
  const [form, setForm] = useState<{title: string; description: string ; image: string | File}>(
    context?.conductor?.metadata || {
      title: "",
      description: "",
      image: "",
    }
  );
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [inviteWallet, setInviteWallet] = useState<string>("");
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [appraisalsLoading, setAppraisalsLoading] = useState<boolean>(false);
  const [hasMoreAppraisals, setHasMoreAppraisals] = useState<boolean>(true);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const handleAllAppraisals = async (
    skip: number = 0,
    reset: boolean = false
  ) => {
    if (appraisalsLoading) return;

    setAppraisalsLoading(true);
    try {
      const limit = 20;
      const data = await getConductorAppraisals(
        Number(context?.conductor?.conductorId),
        limit,
        skip
      );
      const newAppraisals = data?.data?.appraisals || [];

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
    if (hasMoreAppraisals && !appraisalsLoading) {
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
      let hash;
      if (context?.conductor?.conductorId) {
        hash = await walletClient.writeContract({
          address: contracts.appraisals,
          abi: ABIS.IonicConductors,
          functionName: "updateProfile",
          args: [
            Number(context?.conductor?.conductorId),
            "ipfs://" + result.hash,
          ],
          account: address,
        });
      } else {
        hash = await walletClient.writeContract({
          address: contracts.appraisals,
          abi: ABIS.IonicConductors,
          functionName: "registerProfile",
          args: ["ipfs://" + result.hash],
          account: address,
        });
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor((prev) => ({
        ...prev!,
        metadata: {
          title: form.title,
          image,
          description: form.description,
        },
      }));
      
      const message = context?.conductor?.conductorId 
        ? dict?.modals?.conductor?.profileUpdated 
        : dict?.modals?.conductor?.profileCreated;
      
      context?.showSuccess(
        message,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      const errorMessage = context?.conductor?.conductorId
        ? dict?.modals?.conductor?.updateError
        : dict?.modals?.conductor?.createError;
      
      context?.showError(
        errorMessage
      );
    }

    setConductorLoading(false);
  };

  const deleteProfile = async () => {
    if (
      !address ||
      !publicClient ||
      !context?.verified ||
      context?.conductor?.conductorId ||
      !walletClient
    )
      return;

    setDeleteLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: contracts.appraisals,
        abi: ABIS.IonicConductors,
        functionName: "registerProfile",
        args: [Number(context?.conductor?.conductorId)],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor(undefined);
      
      context?.showSuccess(
        dict?.modals?.conductor?.profileDeleted,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.conductor?.deleteError
      );
    }

    setDeleteLoading(false);
  };

  const handleInviteDesigner = async (designer: string) => {
    if (
      !address ||
      !publicClient ||
      !context?.verified ||
      context?.conductor?.conductorId ||
      !walletClient
    )
      return;

    setInviteDesignerLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: contracts.designers,
        abi: ABIS.IonicDesigners,
        functionName: "inviteDesigner",
        args: [designer],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor(undefined);
      
      context?.showSuccess(
        dict?.modals?.conductor?.designerInvited,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.conductor?.inviteError
      );
    }

    setInviteDesignerLoading(false);
  };

  const handleDeactiveDesigner = async (designerId: number, index: number) => {
    if (
      !address ||
      !publicClient ||
      !context?.verified ||
      context?.conductor?.conductorId ||
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
        args: [designerId],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.setConductor(undefined);
      
      context?.showSuccess(
        dict?.modals?.conductor?.designerDeactivated,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.conductor?.deactivateError
      );
    }

    setDeactiveDesignerLoading((prev) => {
      let arr = [...prev];
      arr[index] = false;

      return arr;
    });
  };

  const handleMintIonic = async () => {
    if (!address || !publicClient || !walletClient) return;

    setMintLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.ionic,
        abi: ABIS.IonicConductors,
        functionName: "mint",
        args: [],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      
      context?.showSuccess(
        dict?.modals?.conductor?.ionicMinted,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.conductor?.mintError
      );
    }
    setMintLoading(false);
  };

  useEffect(() => {
    if (address && appraisals.length < 1 && context?.conductor?.conductorId) {
      handleAllAppraisals(0, true);
    }
  }, [address]);

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
    handleMintIonic,
    mintLoading,
    inviteWallet,
    setInviteWallet,
  };
};

export default useConductor;
