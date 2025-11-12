"use client";

import { useParams, useRouter } from "next/navigation";
import { FunctionComponent, JSX } from "react";
import useDesigner from "../hooks/useDesigner";
import Image from "next/image";
import { formatUnits } from "viem";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { formatAddress, formatDate } from "@/app/lib/helpers/getExplorerUrl";

const DesignerEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { designer: designerAddress } = useParams();
  const { designer, designerLoading } = useDesigner(designerAddress as string);
  const router = useRouter();

  if (designerLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.designer?.loading}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh]">
          <div className="stamp-border h-full">
            <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col">
              <div className="stamp-grid-background"></div>
              <div className="text-center text-sm py-8">
                {dict?.designer?.notFound}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-5 justify-start p-4">
            <div className="stamp-grid-background"></div>

            <div className="stamp-spots p-4 w-full relative h-fit">
              <div className="stamp-content-wrapper p-4">
                <div className="flex flex-col lg:flex-row gap-4 relative w-full h-fit">
                  {designer.metadata?.image && (
                    <div className="w-full lg:w-48 h-48 relative border border-black shrink-0 mx-auto lg:mx-0">
                      <Image
                        fill
                        src={
                          designer.metadata.image?.includes("ipfs://")
                            ? `${INFURA_GATEWAY}/ipfs/${
                                designer.metadata.image?.split("ipfs://")?.[1]
                              }`
                            : designer.metadata.image
                        }
                        alt={designer.metadata.title}
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div className="text-center lg:text-left">
                        <h1 className="stamp-title">
                          {designer.metadata?.title ||
                            dict?.designer?.defaultTitle}
                        </h1>
                        <p className="text-xs font-aza text-gray-600">
                          #{designer.designerId}
                        </p>
                      </div>
                      <div className="text-xs font-aza text-gray-600">
                        {formatAddress(designer.wallet)}
                      </div>
                    </div>

                    {designer.metadata?.description && (
                      <p className="text-xs text-left w-full justify-start items-start break-all font-mid text-gray-600 line-clamp-3">
                        {designer.metadata.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-aza">
                      <div className="border border-gray-300 p-3 bg-white/70">
                        <div className="text-base font-brass">
                          {designer.packCount ?? 0}
                        </div>
                        <div className="text-gray-600">
                          {dict?.designer?.totalPacksCreated}
                        </div>
                      </div>
                      <div className="border border-gray-300 p-3 bg-white/70">
                        <div
                          className={`text-base font-brass ${
                            designer.active === true
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {designer.active === true
                            ? dict?.designer?.active
                            : dict?.designer?.inactive}
                        </div>
                        <div className="text-gray-600">
                          {dict?.designer?.status}
                        </div>
                      </div>
                      <div className="border border-gray-300 p-3 bg-white/70">
                        <div className="text-base font-brass">
                          {formatDate(designer.inviteTimestamp)}
                        </div>
                        <div className="text-gray-600">
                          {dict?.designer?.invited}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-aza">
                      <div className="text-gray-700">
                        {dict?.designer?.invited}:{" "}
                        {formatDate(designer.inviteTimestamp)}
                      </div>
                      {designer.invitedBy && (
                        <div className="flex items-center gap-2">
                          {dict?.designer?.invitedBy}:{" "}
                          {designer.invitedBy?.metadata?.image && (
                            <div className="w-5 h-5 relative border border-gray-300">
                              <Image
                                fill
                                src={
                                  designer.invitedBy.metadata.image?.includes(
                                    "ipfs://"
                                  )
                                    ? `${INFURA_GATEWAY}/ipfs/${
                                        designer.invitedBy.metadata.image?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`
                                    : designer.invitedBy.metadata.image
                                }
                                alt={designer.invitedBy.metadata.title}
                                className="object-cover"
                                draggable={false}
                              />
                            </div>
                          )}
                          <button
                            onClick={() =>
                              router.push(
                                `/conductor/${designer.invitedBy?.conductorId}`
                              )
                            }
                            className="text-blue-600 hover:underline"
                          >
                            {designer.invitedBy?.metadata?.title ||
                              `#${designer.invitedBy?.conductorId}`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stamp-spots p-4 w-full h-full">
              <div className="stamp-content-wrapper p-4 flex flex-col w-full relative items-start justify-start gap-4">
                <div className="flex flex-row items-start justify-start w-full relative gap-2">
                  <h2 className="stamp-title text-xs">
                    {dict?.designer?.reactionPacksCreated}
                  </h2>
                  <div className="text-xs font-aza text-gray-600">
                    ({designer.reactionPacks?.length || 0})
                  </div>
                </div>

                {designer.reactionPacks && designer.reactionPacks.length > 0 ? (
                  <div className="w-full flex relative h-fit overflow-y-scroll gap-3 flex-row flex-wrap">
                    {designer.reactionPacks.map((pack, idx: number) => (
                      <div
                        className="relative w-fit flex cursor-pointer"
                        key={idx}
                        onClick={() =>
                          router.push(`/reaction-pack/${pack.packId}`)
                        }
                      >
                        <div className="w-80 relative flex">
                          <div className="stamp-border w-full relative flex h-full">
                            <div className="stamp-content-wrapper p-3 flex flex-col gap-3 relative">
                              {pack.packMetadata?.image && (
                                <div className="w-full h-80 flex relative">
                                  <Image
                                    fill
                                    src={
                                      pack.packMetadata.image?.includes(
                                        "ipfs://"
                                      )
                                        ? `${INFURA_GATEWAY}/ipfs/${
                                            pack.packMetadata.image?.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`
                                        : pack.packMetadata.image
                                    }
                                    alt={pack.packMetadata.title}
                                    objectFit="contain"
                                    draggable={false}
                                  />
                                </div>
                              )}

                              <div className="relative w-full gap-2 flex flex-col">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-sm font-aza line-clamp-1">
                                    {pack.packMetadata?.title ||
                                      dict?.designer?.unnamedPack}
                                  </div>
                                  <div
                                    className={`text-xs font-aza ${
                                      pack.active === true
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    #{pack.packId}{" "}
                                    {pack.active === true
                                      ? dict?.designer?.active
                                      : dict?.designer?.inactive}
                                  </div>
                                </div>

                                <div className="flex flex-row flex-wrap w-full h-fit relative gap-2 justify-between items-center text-xs font-aza">
                                  <div className="relative w-fit h-fit flex flex-col">
                                    <div className="text-sm font-brass">
                                      {formatUnits(
                                        BigInt(pack.currentPrice || 0),
                                        18
                                      )}{" "}
                                      MONA
                                    </div>
                                    <div className="text-gray-600">
                                      {dict?.designer?.price}
                                    </div>
                                  </div>
                                  <div className="relative w-fit h-fit flex flex-col">
                                    <div className="text-sm font-brass">
                                      {pack.soldCount}/{pack.maxEditions}
                                    </div>
                                    <div className="text-gray-600">
                                      {dict?.designer?.sold}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center text-xs font-aza gap-5 flex-wrap">
                                  <div className="text-gray-600">
                                    {pack.reactions?.length || 0}{" "}
                                    {dict?.designer?.reactions}
                                  </div>
                                  {pack.reactions &&
                                    pack.reactions.length > 0 && (
                                      <div className="flex gap-1 flex-wrap">
                                        {pack.reactions
                                          .slice(0, 6)
                                          .map((reaction, rIdx: number) => (
                                            <div
                                              key={rIdx}
                                              className="w-5 h-5 relative border border-gray-200"
                                            >
                                              <Image
                                                fill
                                                src={
                                                  reaction.reactionMetadata?.image?.includes(
                                                    "ipfs://"
                                                  )
                                                    ? `${INFURA_GATEWAY}/ipfs/${
                                                        reaction.reactionMetadata.image?.split(
                                                          "ipfs://"
                                                        )?.[1]
                                                      }`
                                                    : reaction.reactionMetadata
                                                        ?.image
                                                }
                                                alt={
                                                  reaction.reactionMetadata
                                                    ?.title || "reaction"
                                                }
                                                className="object-cover"
                                                draggable={false}
                                              />
                                            </div>
                                          ))}
                                        {pack.reactions.length > 6 && (
                                          <div className="w-5 h-5 border border-gray-200 flex items-center justify-center bg-gray-100">
                                            <span className="text-xs text-gray-500">
                                              +
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-600">
                    {dict?.designer?.noReactionPacks}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerEntry;
