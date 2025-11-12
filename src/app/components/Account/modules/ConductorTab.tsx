"use client";

import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";
import useConductor from "../hooks/useConductor";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import useMint from "../../Common/hooks/useMint";
import { formatDate } from "@/app/lib/helpers/getExplorerUrl";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const ConductorTab: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();

  const {
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
  } = useConductor(dict);

  const { mintLoading, handleMint } = useMint(dict);
  if (Number(context?.verified?.minted) < 1) {
    return (
      <div className="w-full flex flex-col text-black">
        <div className="relative w-full h-fit flex justify-start items-start font-rou text-4xl text-left">
          {dict?.account?.conductor?.mint}
        </div>

        <button
          onClick={handleMint}
          disabled={mintLoading}
          className="relative w-full mt-4 py-2 px-4 bg-black disabled:bg-gray-400 text-white transition-all cursor-pointer"
        >
          {mintLoading
            ? dict?.account?.conductor?.minting
            : dict?.account?.conductor?.mintIonic}
        </button>

        <div className="relative w-full h-72 flex mt-4">
          <Image
            layout="fill"
            objectFit="cover"
            src={"/images/curios.png"}
            draggable={false}
            alt="Cat Eye"
          />
        </div>

        <div className="relative w-full h-fit flex justify-start items-start font-brass text-sm text-left mt-4">
          {dict?.notice?.paragraph1}
        </div>

        <div className="relative w-full h-72 flex mt-4">
          <Image
            layout="fill"
            objectFit="cover"
            src={"/images/viaje.png"}
            draggable={false}
            alt="Cows"
          />
        </div>

        <div className="relative text-black w-full h-fit flex text-justify justify-start items-start font-aza mt-4">
          {dict?.notice?.paragraph2}
          <br />
          <br />
          {dict?.notice?.paragraph3}
          <br />
          <br />
          {dict?.notice?.paragraph4}
        </div>
      </div>
    );
  }

  if (!context?.conductor) {
    return (
      <div className="p-4 w-full flex flex-col text-left justify-start items-start">
        <div className="stamp-title mb-3">
          {dict?.account?.conductor?.registerAsConductor}
        </div>
        <form className="space-y-3 relative w-full flex flex-col items-start justify-start">
          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
            <div>
              <label className="block text-xs mb-1 font-aza">
                {dict?.account?.conductor?.title}
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                placeholder={dict?.account?.conductor?.titlePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-aza">
                {dict?.account?.conductor?.image}
              </label>
              <label className="relative inline-block w-8 h-8 border border-black cursor-pointer hover:bg-gray-200 overflow-hidden">
                {imagePreview !== "" ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    draggable={false}
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs bg-black text-white">
                    +
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setForm((prev) => ({
                        ...prev,
                        image: file,
                      }));
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="relative w-full flex text-left items-start flex-col justify-start">
            <label className="block text-xs mb-1 font-aza">
              {dict?.account?.conductor?.description}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
              placeholder={dict?.account?.conductor?.descriptionPlaceholder}
            />
          </div>
          <button
            type="button"
            onClick={handleConductor}
            disabled={
              conductorLoading || !form.title.trim() || !form.description.trim()
            }
            className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
          >
            {conductorLoading
              ? dict?.account?.conductor?.registering
              : dict?.account?.conductor?.register}
          </button>
          <div className="relative w-full h-72 flex mt-4">
            <Image
              layout="fill"
              objectFit="cover"
              src={"/images/corriendo.png"}
              draggable={false}
              alt="Cows"
            />
          </div>
        </form>
      </div>
    );
  }

  const conductorData = context.conductor;
  return (
    <div className="space-y-3">
      <div className="p-4 w-full flex flex-col text-left justify-start items-start">
        <div className="flex justify-between items-center w-full mb-3 flex-wrap">
          <div className="stamp-title mb-0">
            {dict?.account?.conductor?.profile}
          </div>
          <button
            onClick={() =>
              router.push(`/conductor/${conductorData.conductorId}`)
            }
            className="text-xxs text-gray-600 hover:text-black underline hover:no-underline transition-all font-brass"
          >
            {dict?.account?.conductor?.viewProfilePage}
          </button>
        </div>
        <form className="space-y-3 relative w-full flex flex-col items-start justify-start">
          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
            <div>
              <label className="block text-xs mb-1 font-aza">
                {dict?.account?.conductor?.title}
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                placeholder={dict?.account?.conductor?.titlePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-aza">
                {dict?.account?.conductor?.image}
              </label>
              <label className="relative inline-block w-8 h-8 border border-black cursor-pointer hover:bg-gray-200 overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    draggable={false}
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs bg-black text-white">
                    +
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setForm((prev) => ({
                        ...prev,
                        image: file,
                      }));
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="relative w-full flex text-left items-start flex-col justify-start">
            <label className="block text-xs mb-1 font-aza">
              {dict?.account?.conductor?.description}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
              placeholder={dict?.account?.conductor?.descriptionPlaceholder}
            />
          </div>
          <div className="relative w-fit h-fit flex flex-row gap-2">
            <button
              type="button"
              onClick={handleConductor}
              disabled={
                conductorLoading ||
                !form.title.trim() ||
                !form.description.trim()
              }
              className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
            >
              {conductorLoading
                ? dict?.account?.conductor?.updating
                : dict?.account?.conductor?.update}
            </button>
            <button
              type="button"
              onClick={deleteProfile}
              disabled={deleteLoading}
              className="px-3 py-2 text-xs bg-white text-black border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
            >
              {deleteLoading
                ? dict?.account?.conductor?.deleting
                : dict?.account?.conductor?.delete}
            </button>
          </div>
          <div className="relative w-full h-72 flex mt-4">
            <Image
              layout="fill"
              objectFit="cover"
              src={"/images/cansado.png"}
              draggable={false}
              alt="Cansado"
            />
          </div>
        </form>
      </div>

      <div className="border border-gray-300 p-4 bg-white/50">
        <div className="stamp-title mb-3">
          {dict?.account?.conductor?.statistics}
        </div>
        <div className="flex flex-row flex-wrap gap-2 justify-center items-center relative w-full h-fit">
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">{conductorData.appraisalCount}</div>
            <div className="text-xs text-gray-600">
              {dict?.account?.conductor?.appraisals ?? 0}
            </div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">{conductorData.averageScore}</div>
            <div className="text-xs text-gray-600">
              {dict?.account?.conductor?.avgScore ?? 0}
            </div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">{conductorData.reviewCount}</div>
            <div className="text-xs text-gray-600">
              {dict?.account?.conductor?.reviewCount ?? 0}
            </div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">{conductorData.averageReviewScore}</div>
            <div className="text-xs text-gray-600">
              {dict?.account?.conductor?.reviewScore ?? 0}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-300 p-4 bg-white/50">
        <div className="stamp-title mb-3">
          {dict?.account?.conductor?.appraisals}
        </div>
        <div
          id="appraisals-scroll"
          className="h-64 overflow-auto border border-gray-300"
        >
          <InfiniteScroll
            dataLength={appraisals.length}
            next={loadMoreAppraisals}
            hasMore={hasMoreAppraisals}
            loader={
              <div className="text-center py-2 text-xs">
                {appraisalsLoading ? dict?.account?.conductor?.loading : ""}
              </div>
            }
            scrollableTarget="appraisals-scroll"
          >
            <div className="space-y-1 p-2">
              {appraisals && appraisals.length > 0 ? (
                appraisals.map((appraisal) => (
                  <div
                    key={appraisal.appraisalId}
                    className="border border-black/20 bg-white/85 p-4 flex flex-col justify-start items-start gap-4 w-full h-fit"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 w-full relative">
                      <div className="flex items-center gap-2 text-xs font-aza">
                        <span className="bg-black text-white px-2 py-1">
                          #{appraisal.appraisalId}
                        </span>
                        <span className="text-sm font-brass">
                          {appraisal.overallScore}/100
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(appraisal.blockTimestamp)}
                      </div>
                    </div>

                    <div
                      className="border border-black hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() =>
                        router.push(
                          `/nft/${appraisal.nft?.nftContract}/${appraisal.nft?.nftId}`
                        )
                      }
                    >
                      {appraisal.nft?.metadata?.image && (
                        <div className="w-fit h-fit aspect-square relative border-b border-black">
                          <div className="relative w-10 flex h-10">
                            <Image
                              fill
                              draggable={false}
                              src={
                                appraisal.nft?.metadata.image?.includes(
                                  "ipfs://"
                                )
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      appraisal.nft?.metadata.image?.split(
                                        "ipfs://"
                                      )?.[1]
                                    }`
                                  : appraisal.nft?.metadata.image
                              }
                              alt={appraisal.nft?.metadata.title || "NFT"}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {appraisal.metadata?.comment && (
                      <div className="px-3 py-2 border border-gray-200 bg-white text-xs font-mid text-gray-700 w-full text-left break-all">
                        {appraisal.metadata.comment}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs">
                      {appraisal.metadata?.reactions?.map(
                        (reaction, idx: number) => (
                          <span
                            key={`emoji-${idx}`}
                            className="px-2 py-1 border border-gray-200 bg-white flex items-center gap-1 justify-center"
                          >
                            <span className="flex w-fit h-fit relative">
                              {reaction.emoji}
                            </span>
                            <span className="flex w-fit h-fit relative text-[10px] text-gray-500">
                              x{reaction.count}
                            </span>
                          </span>
                        )
                      )}
                      {appraisal.reactions?.map((reaction, idx: number) => (
                        <span
                          key={`reaction-${idx}`}
                          className="px-2 py-1 border border-gray-200 bg-white flex items-center gap-1 justify-center"
                        >
                          <div className="flex w-fit h-fit relative">
                            <div className="flex w-4 h-4 relative">
                              <Image
                                objectFit="contain"
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  reaction?.reaction?.reactionMetadata?.image?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                draggable={false}
                                alt={
                                  reaction?.reaction?.reactionMetadata?.title
                                }
                              />
                            </div>
                          </div>
                          <span className="flex w-fit h-fit relative text-[10px] text-gray-500">
                            x{reaction.count}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-600">
                  {dict?.conductor?.noAppraisals}
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <div className="border border-gray-300 p-4 bg-white/50">
        <div className="stamp-title mb-3">
          {dict?.account?.conductor?.designerInvites}
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-600 mb-2">
              {dict?.account?.conductor?.availableInvites}:{" "}
              {conductorData.availableInvites || 0}
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={inviteWallet}
                onChange={(e) => setInviteWallet(e.target.value)}
                placeholder={
                  dict?.account?.conductor?.designerWalletPlaceholder
                }
                className="flex-1 p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
              <button
                onClick={() => handleInviteDesigner(inviteWallet)}
                disabled={
                  inviteDesignerLoading ||
                  !inviteWallet.trim() ||
                  Number(conductorData.availableInvites) <= 0
                }
                className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
              >
                {inviteDesignerLoading
                  ? dict?.account?.conductor?.inviting
                  : dict?.account?.conductor?.sendInvite}
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2 font-aza">
              {dict?.account?.conductor?.invitedDesigners}
            </div>
            <div className="border border-black max-h-48 overflow-y-auto">
              {(conductorData.invitedDesigners || []).map((designer, index) => (
                <div
                  key={designer.designerId}
                  className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-default flex-wrap"
                >
                  <div
                    className="flex items-center w-fit h-fit relative gap-2 flex-1 cursor-pointer"
                    onClick={() => router.push(`/designer/${designer.wallet}`)}
                  >
                    {designer.metadata?.image && (
                      <div className="w-6 h-6 relative border border-black flex-shrink-0">
                        <Image
                          draggable={false}
                          fill
                          src={`${INFURA_GATEWAY}/ipfs/${
                            designer.metadata.image?.split("ipfs://")?.[1]
                          }`}
                          alt={designer.metadata.title}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs truncate font-aza">
                        {designer.metadata?.title ||
                          `${designer.wallet.slice(
                            0,
                            6
                          )}...${designer.wallet.slice(-4)}`}
                      </div>
                      <div className="text-xs text-gray-600">
                        {designer.packCount ?? 0}{" "}
                        {dict?.account?.conductor?.packs}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDeactiveDesigner(Number(designer.designerId), index)
                    }
                    disabled={deactiveDesignerLoading[index]}
                    className="px-2 py-1 text-xs bg-white text-black border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex transition-colors rounded"
                  >
                    {deactiveDesignerLoading[index]
                      ? dict?.account?.conductor?.removing
                      : dict?.account?.conductor?.remove}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductorTab;
