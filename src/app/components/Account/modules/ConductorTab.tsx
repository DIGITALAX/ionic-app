"use client";

import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";
import useConductor from "../hooks/useConductor";
import { useRouter } from "next/navigation";
import { DUMMY_APPRAISALS } from "@/app/lib/dummy";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

const ConductorTab: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
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
    handleMintIonic,
    mintLoading,
    inviteWallet,
    setInviteWallet,
  } = useConductor();

  if (!context?.verified) {
    return (
      <div className="border border-black p-3">
        <div className="text-center space-y-3">
          <div className="text-lg font-medium">{dict?.account?.conductor?.verificationRequired}</div>
          <div className="text-sm text-gray-600">
            {dict?.account?.conductor?.verificationMessage}
          </div>
          <button
            className="px-4 py-2 text-sm bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleMintIonic}
            disabled={mintLoading}
          >
            {mintLoading ? dict?.account?.conductor?.minting : dict?.account?.conductor?.mintIonic}
          </button>
        </div>
      </div>
    );
  }

  if (!context?.conductor) {
    return (
      <div className="border border-black p-3">
        <div className="text-base font-medium mb-3">{dict?.account?.conductor?.registerAsConductor}</div>
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">{dict?.account?.conductor?.title}</label>
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
              <label className="block text-xs font-medium mb-1">{dict?.account?.conductor?.image}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || "",
                  }))
                }
                className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
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
              conductorLoading ||
              !form.title.trim() ||
              !form.description.trim()
            }
            className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {conductorLoading ? dict?.account?.conductor?.registering : dict?.account?.conductor?.register}
          </button>
        </form>
      </div>
    );
  }

  const conductorData = context.conductor;

  return (
    <div className="space-y-3">
      <div className="border border-black p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="text-base font-medium">{dict?.account?.conductor?.profile}</div>
          <button
            onClick={() => router.push(`/conductor/${conductorData.conductorId}`)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {dict?.account?.conductor?.viewProfilePage}
          </button>
        </div>
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">{dict?.account?.conductor?.title}</label>
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
              <label className="block text-xs font-medium mb-1">{dict?.account?.conductor?.image}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || "",
                  }))
                }
                className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConductor}
              disabled={
                conductorLoading ||
                !form.title.trim() ||
                !form.description.trim()
              }
              className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {conductorLoading ? dict?.account?.conductor?.updating : dict?.account?.conductor?.update}
            </button>
            <button
              type="button"
              onClick={deleteProfile}
              disabled={deleteLoading}
              className="px-3 py-2 text-xs bg-white text-black border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleteLoading ? dict?.account?.conductor?.deleting : dict?.account?.conductor?.delete}
            </button>
          </div>
        </form>
      </div>

      <div className="border border-black p-3">
        <div className="text-base font-medium mb-3">{dict?.account?.conductor?.statistics}</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm font-medium">
              {conductorData.appraisalCount}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.conductor?.appraisals}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm font-medium">
              {conductorData.averageScore}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.conductor?.avgScore}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm font-medium">{conductorData.reviewCount}</div>
            <div className="text-xs text-gray-600">{dict?.account?.conductor?.reviewCount}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm font-medium">
              {conductorData.averageReviewScore}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.conductor?.reviewScore}</div>
          </div>
        </div>
      </div>

      <div className="border border-black p-3">
        <div className="text-base font-medium mb-3">{dict?.account?.conductor?.appraisals}</div>
        <div id="appraisals-scroll" className="h-64 overflow-auto border border-gray-300">
          <InfiniteScroll
            dataLength={
              (appraisals.length > 0 ? appraisals : DUMMY_APPRAISALS).length
            }
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
              {(appraisals.length > 0 ? appraisals : DUMMY_APPRAISALS).map(
                (appraisal) => (
                  <div
                    key={appraisal.appraisalId}
                    className="border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      router.push(
                        `/nft/${appraisal.nftContract}/${appraisal.nftId}`
                      )
                    }
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium">
                        {dict?.account?.conductor?.nft} #{appraisal.nftId}
                      </span>
                      <span className="text-xs text-gray-600">
                        {dict?.account?.conductor?.score}: {appraisal.overallScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 line-clamp-2 mb-1">
                      {appraisal.metadata?.comment}
                    </div>
                    <div className="flex gap-1">
                      {appraisal.metadata?.reactions?.map((reaction, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-1 py-0.5 rounded"
                        >
                          {reaction.emoji} {reaction.count}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <div className="border border-black p-3">
        <div className="text-base font-medium mb-3">{dict?.account?.conductor?.designerInvites}</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-600 mb-2">
              {dict?.account?.conductor?.availableInvites}: {conductorData.availableInvites}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteWallet}
                onChange={(e) => setInviteWallet(e.target.value)}
                placeholder={dict?.account?.conductor?.designerWalletPlaceholder}
                className="flex-1 p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
              <button
                onClick={() => {
                  handleInviteDesigner(inviteWallet);
                  setInviteWallet("");
                }}
                disabled={
                  inviteDesignerLoading ||
                  !inviteWallet.trim() ||
                  Number(conductorData.availableInvites) <= 0
                }
                className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {inviteDesignerLoading ? dict?.account?.conductor?.inviting : dict?.account?.conductor?.sendInvite}
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">{dict?.account?.conductor?.invitedDesigners}</div>
            <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-300">
              {(conductorData.invitedDesigners || []).map((designer, index) => (
                <div
                  key={designer.designerId}
                  className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    {designer.metadata?.image && (
                      <div className="w-6 h-6 relative border border-gray-300">
                        <Image
                          draggable={false}
                          fill
                          src={designer.metadata.image}
                          alt={designer.metadata.title}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-medium">
                        {designer.metadata?.title ||
                          `${designer.wallet.slice(
                            0,
                            6
                          )}...${designer.wallet.slice(-4)}`}
                      </div>
                      <div className="text-xs text-gray-600">
                        {designer.packCount} {dict?.account?.conductor?.packs}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/designer/${designer.wallet}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      {dict?.account?.conductor?.viewDesignerProfile}
                    </button>
                    <button
                      onClick={() =>
                        handleDeactiveDesigner(Number(designer.designerId), index)
                      }
                      disabled={deactiveDesignerLoading[index]}
                      className="px-2 py-1 text-xs bg-white text-black border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {deactiveDesignerLoading[index] ? dict?.account?.conductor?.removing : dict?.account?.conductor?.remove}
                    </button>
                  </div>
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
