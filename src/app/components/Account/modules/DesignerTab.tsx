"use client";

import { FunctionComponent, JSX, useContext, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import InfiniteScroll from "react-infinite-scroll-component";
import { ModalContext } from "@/app/providers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const DesignerTab: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
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
    imagePreview,
  } = useDesigner(dict);

  if (!context?.designer) {
    return (
      <div className="p-3">
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
          <div className="p-4 w-full flex flex-col text-left justify-start items-start">
            <div className="flex justify-between items-center w-full mb-3 flex-wrap">
              <div className="stamp-title mb-0">
                {dict?.account?.designer?.profile}
              </div>
              <button
                onClick={() => router.push(`/designer/${address}`)}
                className="text-xxs text-gray-600 hover:text-black underline hover:no-underline transition-all font-brass"
              >
                {dict?.account?.designer?.viewProfilePage}
              </button>
            </div>
            <form className="space-y-3 relative w-full flex flex-col items-start justify-start">
              <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
                <div>
                  <label className="block text-xs mb-1 font-aza">
                    {dict?.account?.designer?.title}
                  </label>
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
                  <label className="block text-xs mb-1 font-aza">
                    {dict?.account?.designer?.image}
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
                  {dict?.account?.designer?.description}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
                  placeholder={dict?.account?.designer?.descriptionPlaceholder}
                />
              </div>
              <button
                type="button"
                onClick={handleUpdateDesigner}
                disabled={
                  updateLoading ||
                  !form.title.trim() ||
                  !form.description.trim()
                }
                className="px-3 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
              >
                {updateLoading
                  ? dict?.account?.designer?.updating
                  : dict?.account?.designer?.update}
              </button>
              <div className="relative w-full h-72 flex mt-4">
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={"/images/estirado.png"}
                  draggable={false}
                  alt="Cows"
                />
              </div>
            </form>
          </div>

          <div className="border border-black p-3">
            <div className="text-base mb-3">
              {dict?.account?.designer?.statistics}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-gray-300 p-2 text-center">
                <div className="text-sm">{context?.designer?.packCount}</div>
                <div className="text-xs text-gray-600">
                  {dict?.account?.designer?.packs}
                </div>
              </div>
              <div className="border border-gray-300 p-2 text-center">
                <div className="text-sm">
                  {new Date(
                    Number(context?.designer?.inviteTimestamp) * 1000
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs text-gray-600">
                  {dict?.account?.designer?.invited}
                </div>
              </div>
              <div className="border border-gray-300 p-2 text-center">
                <div className="text-sm">
                  #
                  {context?.designer?.invitedBy?.metadata?.title ??
                    context?.designer?.invitedBy?.conductorId}
                </div>
                <div className="text-xs text-gray-600">
                  {dict?.account?.designer?.invitedBy}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black p-3">
            <div className="text-base mb-3">
              {dict?.account?.designer?.yourPacks}
            </div>
            <div
              id="packs-scroll"
              className="h-64 overflow-auto border border-gray-300"
            >
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
                      className="border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer font-mid"
                      onClick={() =>
                        router.push(`/reaction-pack/${pack.packId}`)
                      }
                    >
                      <div className="flex gap-2 w-full relative h-fit justify-between items-center sm:flex-nowrap flex-wrap flex-row">
                        <div className="relative w-fit h-fit flex flex-row gap-2">
                          <div className="relative w-fit h-fit flex">
                            <div className="w-10 h-10 relative border border-gray-200">
                              <Image
                                fill
                                draggable={false}
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  pack.packMetadata.image?.split("ipfs://")?.[1]
                                }`}
                                alt={pack.packMetadata.title}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <span className="text-xs relative flex w-fit h-fit">
                            {pack.packMetadata.title}
                          </span>
                        </div>
                        <div className="flex relative w-fit h-fit flex-col gap-2 justify-between text-xs text-gray-600">
                          <span>
                            {dict?.account?.designer?.sold}: {pack.soldCount}/
                            {pack.maxEditions}
                          </span>
                          <span>
                            {dict?.account?.designer?.reserved}:{" "}
                            {pack.conductorReservedSpots}
                          </span>
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
        <div className="p-4 w-full flex flex-col text-left justify-start items-start">
          <div className="stamp-title mb-3">
            {dict?.account?.designer?.createPack}
          </div>
          <form className="space-y-4 relative w-full flex flex-col items-start justify-start">
            <div className="space-y-3 relative w-full">
              <h3 className="text-base font-aza">
                {dict?.account?.designer?.packMetadata}
              </h3>
              <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
                <div>
                  <label className="block text-xs mb-1 font-aza">
                    {dict?.account?.designer?.packTitle}
                  </label>
                  <input
                    type="text"
                    value={createPackData.packMetadata.title}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        packMetadata: {
                          ...prev.packMetadata,
                          title: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                    placeholder={dict?.account?.designer?.packTitlePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-aza">
                    {dict?.account?.designer?.packImage}
                  </label>
                  <label className="relative inline-block w-8 h-8 cursor-pointer hover:bg-gray-200 overflow-hidden">
                    {createPackData.packMetadata.image ? (
                      <Image
                        src={URL.createObjectURL(
                          createPackData.packMetadata.image
                        )}
                        alt="Preview"
                        fill
                        draggable={false}
                        objectFit="contain"
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
                          setCreatePackData((prev) => ({
                            ...prev,
                            packMetadata: {
                              ...prev.packMetadata,
                              image: file,
                            },
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
                  {dict?.account?.designer?.packDescription}
                </label>
                <textarea
                  value={createPackData.packMetadata.description}
                  onChange={(e) =>
                    setCreatePackData((prev) => ({
                      ...prev,
                      packMetadata: {
                        ...prev.packMetadata,
                        description: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
                  placeholder={
                    dict?.account?.designer?.packDescriptionPlaceholder
                  }
                />
              </div>
            </div>

            <div className="space-y-3 relative w-full">
              <h3 className="text-base font-aza">
                {dict?.account?.designer?.packSettings}
              </h3>
              <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
                <div>
                  <label className="block text-xs mb-1 font-aza">
                    {dict?.account?.designer?.maxEditions}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={createPackData.maxEditions}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        maxEditions: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-aza">
                    {dict?.account?.designer?.conductorSpots}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={createPackData.conductorReservedSpots}
                    onChange={(e) =>
                      setCreatePackData((prev) => ({
                        ...prev,
                        conductorReservedSpots: Math.min(
                          10,
                          Math.max(0, parseInt(e.target.value) || 0)
                        ),
                      }))
                    }
                    className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 relative w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-aza">
                  {dict?.account?.designer?.reactions} (
                  {createPackData.reactions.length}/10)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    if (createPackData.reactions.length < 10) {
                      setCreatePackData((prev) => ({
                        ...prev,
                        reactions: [
                          ...prev.reactions,
                          {
                            title: "",
                            description: "",
                            image: undefined,
                            model: "",
                            workflow: "",
                            prompt: "",
                          },
                        ],
                      }));
                    }
                  }}
                  disabled={createPackData.reactions.length >= 10}
                  className="px-2 py-1 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  {dict?.account?.designer?.addReaction}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {createPackData.reactions.map((reaction, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 p-3 space-y-2 w-80 flex-shrink-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-aza">
                        {dict?.account?.designer?.reaction} #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCreatePackData((prev) => ({
                            ...prev,
                            reactions: prev.reactions.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        {dict?.account?.designer?.remove}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.account?.designer?.reactionTitle}
                        </label>
                        <input
                          type="text"
                          value={reaction.title}
                          onChange={(e) => {
                            const newReactions = [...createPackData.reactions];
                            newReactions[index] = {
                              ...newReactions[index],
                              title: e.target.value,
                            };
                            setCreatePackData((prev) => ({
                              ...prev,
                              reactions: newReactions,
                            }));
                          }}
                          className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                          placeholder={
                            dict?.account?.designer?.reactionTitlePlaceholder
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.account?.designer?.reactionModel}
                        </label>
                        <input
                          type="text"
                          value={reaction.model || ""}
                          onChange={(e) => {
                            const newReactions = [...createPackData.reactions];
                            newReactions[index] = {
                              ...newReactions[index],
                              model: e.target.value,
                            };
                            setCreatePackData((prev) => ({
                              ...prev,
                              reactions: newReactions,
                            }));
                          }}
                          className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                          placeholder={
                            dict?.account?.designer?.reactionModelPlaceholder
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1 font-aza">
                        {dict?.account?.designer?.reactionDescription}
                      </label>
                      <textarea
                        value={reaction.description}
                        onChange={(e) => {
                          const newReactions = [...createPackData.reactions];
                          newReactions[index] = {
                            ...newReactions[index],
                            description: e.target.value,
                          };
                          setCreatePackData((prev) => ({
                            ...prev,
                            reactions: newReactions,
                          }));
                        }}
                        className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black h-16 resize-none"
                        placeholder={
                          dict?.account?.designer
                            ?.reactionDescriptionPlaceholder
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.account?.designer?.reactionWorkflow}
                        </label>
                        <input
                          type="text"
                          value={reaction.workflow || ""}
                          onChange={(e) => {
                            const newReactions = [...createPackData.reactions];
                            newReactions[index] = {
                              ...newReactions[index],
                              workflow: e.target.value,
                            };
                            setCreatePackData((prev) => ({
                              ...prev,
                              reactions: newReactions,
                            }));
                          }}
                          className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                          placeholder={
                            dict?.account?.designer?.reactionWorkflowPlaceholder
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.account?.designer?.reactionPrompt}
                        </label>
                        <input
                          type="text"
                          value={reaction.prompt || ""}
                          onChange={(e) => {
                            const newReactions = [...createPackData.reactions];
                            newReactions[index] = {
                              ...newReactions[index],
                              prompt: e.target.value,
                            };
                            setCreatePackData((prev) => ({
                              ...prev,
                              reactions: newReactions,
                            }));
                          }}
                          className="w-full p-1 text-xs border border-gray-300 focus:outline-none focus:border-black"
                          placeholder={
                            dict?.account?.designer?.reactionPromptPlaceholder
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1 font-aza">
                        {dict?.account?.designer?.reactionImage}
                      </label>
                      <label className="relative inline-block w-8 h-8 cursor-pointer hover:bg-gray-200 overflow-hidden">
                        {reaction.image ? (
                          <Image
                            src={URL.createObjectURL(reaction.image)}
                            alt="Preview"
                            fill
                            draggable={false}
                            objectFit="contain"
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
                              const newReactions = [
                                ...createPackData.reactions,
                              ];
                              newReactions[index] = {
                                ...newReactions[index],
                                image: file,
                              };
                              setCreatePackData((prev) => ({
                                ...prev,
                                reactions: newReactions,
                              }));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {createPackData.reactions.length === 0 && (
                <div className="text-center py-4 text-xs text-gray-600">
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
                !createPackData.reactions.every(
                  (r) => r.title.trim() && r.description.trim() && r.image
                )
              }
              className="w-full px-4 py-2 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
            >
              {createLoading
                ? dict?.account?.designer?.creating
                : dict?.account?.designer?.create}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DesignerTab;
