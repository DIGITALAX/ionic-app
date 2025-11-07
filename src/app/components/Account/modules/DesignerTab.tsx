"use client";

import { FunctionComponent, JSX, useContext, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import InfiniteScroll from "react-infinite-scroll-component";
import { ModalContext } from "@/app/providers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

const DesignerTab: FunctionComponent<{dict: any}> = ({dict}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const { address } = useAccount();
  const [activeSubTab, setActiveSubTab] = useState<string>("profile");
  const {
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
  } = useDesigner();

  if (!context?.designer) {
    return (
      <div className="border border-black p-3">
        <div className="text-center">
          <div className="text-sm text-gray-600">
            {dict?.account?.designer?.notInvited}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border border-black">
        <div className="flex">
          <button
            onClick={() => setActiveSubTab("profile")}
            className={`py-2 px-3 text-sm border-r border-black transition-colors ${
              activeSubTab === "profile"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.account?.designer?.profileTab}
          </button>
          <button
            onClick={() => setActiveSubTab("create")}
            className={`py-2 px-3 text-sm transition-colors ${
              activeSubTab === "create"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.account?.designer?.createTab}
          </button>
        </div>
      </div>

      {activeSubTab === "profile" && (
        <div className="space-y-3">
      <div className="border border-black p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="text-base">{dict?.account?.designer?.profile}</div>
          <button
            onClick={() => router.push(`/designer/${address}`)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {dict?.account?.designer?.viewProfilePage}
          </button>
        </div>
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">{dict?.account?.designer?.title}</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                placeholder={dict?.account?.designer?.titlePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">{dict?.account?.designer?.image}</label>
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
            <label className="block text-xs mb-1">
              {dict?.account?.designer?.description}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
              placeholder={dict?.account?.designer?.descriptionPlaceholder}
            />
          </div>
          <button
            type="button"
            onClick={handleUpdateDesigner}
            disabled={
              updateLoading || !form.title.trim() || !form.description.trim()
            }
            className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateLoading ? dict?.account?.designer?.updating : dict?.account?.designer?.update}
          </button>
        </form>
      </div>

      <div className="border border-black p-3">
        <div className="text-base mb-3">{dict?.account?.designer?.statistics}</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {context?.designer?.packCount}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.designer?.packs}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              {new Date(
                Number(context?.designer?.inviteTimestamp) * 1000
              ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.designer?.invited}</div>
          </div>
          <div className="border border-gray-300 p-2 text-center">
            <div className="text-sm">
              #{context?.designer?.invitedBy}
            </div>
            <div className="text-xs text-gray-600">{dict?.account?.designer?.invitedBy}</div>
          </div>
        </div>
      </div>

      <div className="border border-black p-3">
        <div className="text-base mb-3">{dict?.account?.designer?.yourPacks}</div>
        <div id="packs-scroll" className="h-64 overflow-auto border border-gray-300">
          <InfiniteScroll
            dataLength={packs.length}
            next={loadMorePacks}
            hasMore={hasMorePacks}
            loader={
              <div className="text-center py-2 text-xs">
                {packsLoading ? dict?.account?.designer?.loadingPacks : ""}
              </div>
            }
            scrollableTarget="packs-scroll"
          >
            <div className="space-y-1 p-2">
              {packs.map((pack) => (
                <div
                  key={pack.packId}
                  className="border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>router.push(`/reaction-pack/${pack.packId}`)}
                >
                  <div className="flex gap-2">
                    <div className="w-10 h-10 relative border border-gray-200">
                      <Image
                        fill
                        draggable={false}
                        src={pack.packMetadata.image}
                        alt={pack.packMetadata.title}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs">
                          {pack.packMetadata.title}
                        </span>
                        <span className="text-xs text-gray-600">
                          {dict?.account?.designer?.active}: {pack.active}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {dict?.account?.designer?.pack} #{pack.packId}
                      </div>
                      <div className="text-xs text-gray-700 line-clamp-1 mb-1">
                        {pack.packMetadata.description}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>
                          {dict?.account?.designer?.sold}: {pack.soldCount}/{pack.maxEditions}
                        </span>
                        <span>{dict?.account?.designer?.reserved}: {pack.conductorReservedSpots}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {packs.length === 0 && !packsLoading && (
                <div className="text-center py-6 text-xs text-gray-600">
                  {dict?.account?.designer?.noPacks}
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
        </div>
      )}

      {activeSubTab === "create" && (
        <div className="border border-black p-3">
          <div>
            <div className="text-base mb-3">{dict?.account?.designer?.createPack}</div>
            <form className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-base">{dict?.account?.designer?.packMetadata}</h3>
                <div>
                  <label className="block text-xs mb-1">{dict?.account?.designer?.packTitle}</label>
                  <input
                    type="text"
                    value={createPackData.packMetadata.title}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        packMetadata: { ...prev.packMetadata, title: e.target.value }
                      }))
                    }
                    className="w-full p-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                    placeholder={dict?.account?.designer?.packTitlePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">{dict?.account?.designer?.packDescription}</label>
                  <textarea
                    value={createPackData.packMetadata.description}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        packMetadata: { ...prev.packMetadata, description: e.target.value }
                      }))
                    }
                    className="w-full p-2 text-sm border border-gray-300 focus:outline-none focus:border-black h-20 resize-none"
                    placeholder={dict?.account?.designer?.packDescriptionPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">{dict?.account?.designer?.packImage}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        packMetadata: { ...prev.packMetadata, image: e.target.files?.[0] }
                      }))
                    }
                    className="w-full p-1 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base">{dict?.account?.designer?.packSettings}</h3>
                <div>
                  <label className="block text-xs mb-1">{dict?.account?.designer?.maxEditions}</label>
                  <input
                    type="number"
                    min="1"
                    value={createPackData.maxEditions}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        maxEditions: Math.max(1, parseInt(e.target.value) || 1)
                      }))
                    }
                    className="w-full p-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">{dict?.account?.designer?.conductorSpots}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={createPackData.conductorReservedSpots}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        conductorReservedSpots: Math.min(10, Math.max(0, parseInt(e.target.value) || 0))
                      }))
                    }
                    className="w-full p-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-base">{dict?.account?.designer?.reactions} ({createPackData.reactions.length}/10)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (createPackData.reactions.length < 10) {
                        setCreatePackData((prev) => ({
                          ...prev,
                          reactions: [...prev.reactions, {
                            title: "",
                            description: "",
                            image: undefined,
                            model: "",
                            workflow: "",
                            prompt: ""
                          }]
                        }));
                      }
                    }}
                    disabled={createPackData.reactions.length >= 10}
                    className="px-2 py-1 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {dict?.account?.designer?.addReaction}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {createPackData.reactions.map((reaction, index) => (
                    <div key={index} className="border border-gray-300 p-3 space-y-2 w-80 flex-shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{dict?.account?.designer?.reaction} #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCreatePackData((prev) => ({
                              ...prev,
                              reactions: prev.reactions.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          {dict?.account?.designer?.remove}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1">{dict?.account?.designer?.reactionTitle}</label>
                          <input
                            type="text"
                            value={reaction.title}
                            onChange={(e) => {
                              const newReactions = [...createPackData.reactions];
                              newReactions[index] = { ...newReactions[index], title: e.target.value };
                              setCreatePackData((prev) => ({ ...prev, reactions: newReactions }));
                            }}
                            className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                            placeholder={dict?.account?.designer?.reactionTitlePlaceholder}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">{dict?.account?.designer?.reactionModel}</label>
                          <input
                            type="text"
                            value={reaction.model || ""}
                            onChange={(e) => {
                              const newReactions = [...createPackData.reactions];
                              newReactions[index] = { ...newReactions[index], model: e.target.value };
                              setCreatePackData((prev) => ({ ...prev, reactions: newReactions }));
                            }}
                            className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                            placeholder={dict?.account?.designer?.reactionModelPlaceholder}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">{dict?.account?.designer?.reactionDescription}</label>
                        <textarea
                          value={reaction.description}
                          onChange={(e) => {
                            const newReactions = [...createPackData.reactions];
                            newReactions[index] = { ...newReactions[index], description: e.target.value };
                            setCreatePackData((prev) => ({ ...prev, reactions: newReactions }));
                          }}
                          className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
                          placeholder={dict?.account?.designer?.reactionDescriptionPlaceholder}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1">{dict?.account?.designer?.reactionWorkflow}</label>
                          <input
                            type="text"
                            value={reaction.workflow || ""}
                            onChange={(e) => {
                              const newReactions = [...createPackData.reactions];
                              newReactions[index] = { ...newReactions[index], workflow: e.target.value };
                              setCreatePackData((prev) => ({ ...prev, reactions: newReactions }));
                            }}
                            className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                            placeholder={dict?.account?.designer?.reactionWorkflowPlaceholder}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">{dict?.account?.designer?.reactionPrompt}</label>
                          <input
                            type="text"
                            value={reaction.prompt || ""}
                            onChange={(e) => {
                              const newReactions = [...createPackData.reactions];
                              newReactions[index] = { ...newReactions[index], prompt: e.target.value };
                              setCreatePackData((prev) => ({ ...prev, reactions: newReactions }));
                            }}
                            className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                            placeholder={dict?.account?.designer?.reactionPromptPlaceholder}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">{dict?.account?.designer?.reactionImage}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const newReactions = [...createPackData.reactions];
                            newReactions[index] = { ...newReactions[index], image: e.target.files?.[0] };
                            setCreatePackData((prev) => ({ ...prev, reactions: newReactions }));
                          }}
                          className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {createPackData.reactions.length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-600">
                    {dict?.account?.designer?.noReactions}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={createReactionPack}
                disabled={
                  createLoading ||
                  !createPackData.packMetadata.title.trim() ||
                  !createPackData.packMetadata.description.trim() ||
                  !createPackData.packMetadata.image ||
                  createPackData.reactions.length < 1 ||
                  !createPackData.reactions.every(r => r.title.trim() && r.description.trim() && r.image)
                }
                className="w-full px-4 py-2 text-sm bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createLoading ? dict?.account?.designer?.creating : dict?.account?.designer?.create}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerTab;
