import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Review } from "../../Common/types/common.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
  INFURA_GATEWAY,
} from "@/app/lib/constants";
import { ABIS } from "@/abis";
import {
  getReviewer,
  getReviewerReviews,
} from "@/app/lib/queries/subgraph/getReviewers";
import { ensureMetadata } from "@/app/lib/utils";

const useReviewer = (dict: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [reviewerLoading, setReviewerLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    image: string | File;
  }>(
    context?.reviewer?.metadata || {
      title: "",
      description: "",
      image: "",
    }
  );

  const handleAllReviews = async (skip: number = 0, reset: boolean = false) => {
    if (reviewsLoading || !address) return;

    setReviewsLoading(true);
    try {
      const limit = 20;
      const data = await getReviewerReviews(address, limit, skip);
      const newReviews = data?.data?.reviews || [];

      if (reset) {
        setReviews(newReviews);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
      }

      setHasMoreReviews(newReviews.length === limit);
    } catch (err: any) {
      console.error(err.message);
    }
    setReviewsLoading(false);
  };

  const loadMoreReviews = () => {
    if (hasMoreReviews && !reviewsLoading) {
      handleAllReviews(reviews.length, false);
    }
  };

  const handleReviewer = async () => {
    if (!address) return;
    setReviewerLoading(true);
    try {
      const data = await getReviewer(address);
      const ensured = await ensureMetadata(data?.data?.reviewers?.[0]);
      context?.setReviewer(ensured);
    } catch (err: any) {
      console.error(err.message);
    }
    setReviewerLoading(false);
  };

  const handleUpdateReviewer = async () => {
    if (
      !address ||
      !publicClient ||
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
      let hash;
      hash = await walletClient.writeContract({
        address: contracts.conductors,
        abi: ABIS.IonicConductors,
        functionName: "updateReviewerURI",
        args: ["ipfs://" + result.hash],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context?.setReviewer((prev) => ({
        ...prev!,
        metadata: {
          title: form.title,
          image,
          description: form.description,
        },
      }));

      context?.showSuccess(dict?.modals?.reviewer?.profileUpdated, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.modals?.reviewer?.updateError);
    }

    setUpdateLoading(false);
  };

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
    if (context?.reviewer) {
      setForm({
        title: context?.reviewer?.metadata?.title ?? "",
        description: context?.reviewer?.metadata?.description ?? "",
        image: context?.reviewer?.metadata?.image ?? "",
      });
      if (
        context?.reviewer?.metadata?.image &&
        context?.reviewer?.metadata?.image !== ""
      ) {
        setImagePreview(
          `${INFURA_GATEWAY}/ipfs/${
            context?.reviewer?.metadata?.image?.split("ipfs://")?.[1]
          }`
        );
      }
    }
  }, [context?.reviewer]);

  useEffect(() => {
    if (address && reviews.length < 1) {
      handleAllReviews(0, true);
    }

    if (address && !context?.reviewer) {
      handleReviewer();
    }
  }, [address]);

  return {
    reviewerLoading,
    updateLoading,
    handleUpdateReviewer,
    form,
    setForm,
    reviews,
    reviewsLoading,
    hasMoreReviews,
    loadMoreReviews,
    imagePreview,
    setImagePreview,
  };
};

export default useReviewer;
