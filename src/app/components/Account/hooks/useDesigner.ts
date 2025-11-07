import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { BaseMetadata, ReactionPack } from "../../Common/types/common.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import {
  getDesigner,
  getDesignerPacks,
} from "@/app/lib/queries/subgraph/getDesigners";
import { DUMMY_PACKS } from "@/app/lib/dummy";

const useDesigner = (dict?: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [designerLoading, setDesignerLoading] = useState<boolean>(false);
  const [packs, setPacks] = useState<ReactionPack[]>([]);
  const [packsLoading, setPacksLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [hasMorePacks, setHasMorePacks] = useState<boolean>(true);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createPackData, setCreatePackData] = useState<{
    maxEditions: number;
    conductorReservedSpots: number;
    packMetadata: {
      title: string;
      description: string;
      image?: File;
    };
    reactions: {
      title: string;
      description: string;
      image?: File;
      model?: string;
      workflow?: string;
      prompt?: string;
    }[];
  }>({
    maxEditions: 100,
    conductorReservedSpots: 3,
    packMetadata: {
      title: "",
      description: "",
    },
    reactions: [],
  });
  const [form, setForm] = useState<{
    title: string;
    description: string;
    image: string | File;
  }>(
    context?.designer?.metadata || {
      title: "",
      description: "",
      image: "",
    }
  );

  const handleAllPacks = async (skip: number = 0, reset: boolean = false) => {
    if (packsLoading || !address) return;

    setPacksLoading(true);
    try {
      const limit = 20;
      const data = await getDesignerPacks(address, limit, skip);
      const newPacks = data?.data?.reactionPacks || [];

      if (reset) {
        setPacks(newPacks);
      } else {
        setPacks((prev) => [...prev, ...newPacks]);
      }

      setHasMorePacks(newPacks.length === limit);
    } catch (err: any) {
      console.error(err.message);
    }
    setPacksLoading(false);
  };

  const loadMorePacks = () => {
    if (hasMorePacks && !packsLoading) {
      handleAllPacks(packs.length, false);
    }
  };

  const handleDesigner = async () => {
    if (!address) return;
    setDesignerLoading(true);
    try {
      const data = await getDesigner(address);
      context?.setDesigner(data?.data?.designers?.[0]);
    } catch (err: any) {
      console.error(err.message);
    }
    setDesignerLoading(false);
  };

  const handleUpdateDesigner = async () => {
    if (
      !address ||
      !publicClient ||
      !context?.designer ||
      form.title.trim() == "" ||
      form.description.trim() == "" ||
      !walletClient
    )
      return;

    setUpdateLoading(true);

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
        address: contracts.designers,
        abi: ABIS.IonicDesigners,
        functionName: "setDesignerURI",
        args: [Number(context?.designer?.designerId), "ipfs://" + result.hash],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setDesigner((prev) => ({
        ...prev!,
        metadata: {
          title: form.title,
          image,
          description: form.description,
        },
      }));
      
      context?.showSuccess(
        dict?.modals?.designer?.profileUpdated,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.designer?.updateError
      );
    }

    setUpdateLoading(false);
  };

  const createReactionPack = async () => {
    if (
      !address ||
      !publicClient ||
      !context?.designer ||
      createPackData.conductorReservedSpots > 10 ||
      createPackData.packMetadata.title.trim() == "" ||
      createPackData.packMetadata.description.trim() == "" ||
      !createPackData.packMetadata.image ||
      !createPackData.reactions.every(
        (obj) =>
          obj.description.trim() !== "" && obj.title.trim() !== "" && obj.image
      ) ||
      !walletClient
    )
      return;

    setCreateLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", createPackData.packMetadata.image);

      const responseImage = await fetch("/api/ipfs", {
        method: "POST",
        body: formData,
      });

      const resImage = await responseImage.json();

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: createPackData.packMetadata.title,
          image: "ipfs://" + resImage.hash,
          description: createPackData.packMetadata.description,
        }),
      });
      const result = await response.json();

      const reactionURIs = await Promise.all(
        createPackData.reactions.map(async (react) => {
          const formData = new FormData();
          formData.append("file", react.image as File);

          const responseImage = await fetch("/api/ipfs", {
            method: "POST",
            body: formData,
          });

          const resImage = await responseImage.json();

          const response = await fetch("/api/ipfs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: react.title,
              image: "ipfs://" + resImage.hash,
              description: react.description,
              model: react.model,
              workflow: react.workflow,
              prompt: react.prompt,
            }),
          });
          const result = await response.json();

          return "ipfs://" + result.hash;
        })
      );

      const hash = await walletClient.writeContract({
        address: contracts.reactionPacks,
        abi: ABIS.IonicReactionPacks,
        functionName: "createReactionPack",
        args: [
          createPackData.maxEditions,
          createPackData.conductorReservedSpots,
          "ipfs://" + result.hash,
          reactionURIs,
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setCreatePackData({
        maxEditions: 100,
        conductorReservedSpots: 3,
        packMetadata: {
          title: "",
          description: "",
        },
        reactions: [],
      });
      await handleAllPacks();
      
      context?.showSuccess(
        dict?.modals?.designer?.reactionPackCreated,
        hash
      );
    } catch (err: any) {
      console.error(err.message);
      context?.showError(
        dict?.modals?.designer?.createPackError
      );
    }
    setCreateLoading(false);
  };

  useEffect(() => {
    if (address && packs.length < 1) {
      handleAllPacks(0, true);
    }

    if (address && !context?.designer) {
      handleDesigner();
    }
  }, [address]);

  useEffect(() => {
    if (packs.length < 1) {
      setPacks(DUMMY_PACKS);
    }
  }, []);

  return {
    designerLoading,
    updateLoading,
    handleUpdateDesigner,
    form,
    setForm,
    packs,
    packsLoading,
    hasMorePacks,
    loadMorePacks,
    createReactionPack,
    createLoading,
    createPackData,
    setCreatePackData,
  };
};

export default useDesigner;
