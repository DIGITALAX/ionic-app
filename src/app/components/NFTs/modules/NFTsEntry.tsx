"use client";

import { FunctionComponent, JSX, useState } from "react";
import useNFTs from "../hooks/useNFTs";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TokenType } from "../types/nfts.types";
import Metadata from "@/app/components/Common/modules/Metadata";

const NFTsEntry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const {
    nfts,
    nftsLoading,
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
  } = useNFTs(dict);
  const router = useRouter();

  const tokenTypeOptions = [
    { value: TokenType.ERC721, label: "ERC-721" },
    { value: TokenType.ERC1155, label: "ERC-1155" },
    { value: TokenType.ERC998, label: "ERC-998" },
  ];

  const selectedTokenLabel = tokenTypeOptions.find(
    (opt) => opt.value === formData.tokenType
  )?.label;

  return (
    <div className="w-full flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper overflow-y-scroll h-full flex flex-col gap-5 justify-start">
            <div className="flex flex-col gap-3 relative w-full h-fit items-center justify-center">
              <h1 className="stamp-title">{dict?.nfts?.title}</h1>
              <button
                onClick={() => setShowSubmitForm(!showSubmitForm)}
                className="text-xs bg-black text-white px-3 py-1 hover:bg-gray-800 transition-colors w-fit rounded"
              >
                {showSubmitForm ? dict?.nfts?.hideForm : dict?.nfts?.submitNft}
              </button>
            </div>

            {showSubmitForm && (
              <div className="stamp-border p-4 mb-4">
                <div className="stamp-content-wrapper">
                  <h2 className="stamp-title mb-3">
                    {dict?.nfts?.submitNewNft}
                  </h2>
                  <form className="space-y-3 relative w-full flex flex-col items-start justify-start">
                    <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.nfts?.tokenAddress}
                        </label>
                        <input
                          type="text"
                          value={formData.tokenAddress}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tokenAddress: e.target.value,
                            }))
                          }
                          placeholder={dict?.nfts?.tokenAddressPlaceholder}
                          className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.nfts?.tokenId}
                        </label>
                        <input
                          type="number"
                          value={formData.tokenId}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tokenId: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder={dict?.nfts?.tokenIdPlaceholder}
                          className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                    <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left items-start justify-start">
                      <div>
                        <label className="block text-xs mb-1 font-aza">
                          {dict?.nfts?.tokenType}
                        </label>
                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() =>
                              setShowTokenTypeDropdown(!showTokenTypeDropdown)
                            }
                            className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-black bg-white text-left flex items-center justify-between"
                          >
                            <span>{selectedTokenLabel}</span>
                            <span className="text-xs">
                              {showTokenTypeDropdown ? "▲" : "▼"}
                            </span>
                          </button>
                          {showTokenTypeDropdown && (
                            <div className="absolute top-full left-0 right-0 border border-gray-300 border-t-0 bg-white z-10">
                              {tokenTypeOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      tokenType: option.value,
                                    }));
                                    setShowTokenTypeDropdown(false);
                                  }}
                                  className={`w-full p-2 text-xs text-left border-b border-gray-300 last:border-b-0 hover:bg-gray-100 ${
                                    formData.tokenType === option.value
                                      ? "bg-gray-200 font-bold"
                                      : ""
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmitNFT}
                      disabled={
                        submitLoading ||
                        !formData.tokenAddress ||
                        !formData.tokenId
                      }
                      className="w-full py-2 px-4 bg-black disabled:bg-gray-400 text-white text-xs hover:bg-gray-800 disabled:cursor-not-allowed transition-all rounded"
                    >
                      {submitLoading
                        ? dict?.nfts?.submitting
                        : dict?.nfts?.submit}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {nfts.length > 0 ? (
              <div className="stamp-spots p-4 w-full h-full">
                <div className="stamp-content-wrapper">
                  <div
                    id="nfts-scroll"
                    className="w-full max-h-96 overflow-auto flex items-start justify-start relative"
                  >
                    <InfiniteScroll
                      dataLength={nfts.length}
                      next={loadMoreNfts}
                      hasMore={hasMoreNfts}
                      loader={
                        <div className="text-center py-2 text-xs text-gray-600">
                          {nftsLoading ? dict?.nfts?.loading : ""}
                        </div>
                      }
                      scrollableTarget="nfts-scroll"
                    >
                      <div className="w-full flex flex-row justify-between items-start gap-3">
                        {nfts.map((nft) => (
                          <div
                            key={nft.nftId}
                            className="border border-black hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() =>
                              router.push(
                                `/nft/${nft.nftContract}/${nft.nftId}`
                              )
                            }
                          >
                            <div className="space-y-1">
                              {(nft.metadata?.image || nft.metadata?.video) && (
                                <div className="w-fit h-fit aspect-square relative border-b border-black">
                                  <div className="relative w-40 flex h-40">
                                    <Metadata metadata={nft.metadata} />
                                  </div>
                                </div>
                              )}
                              <div className="p-2">
                                <h3 className="text-xs line-clamp-1 font-aza">
                                  {nft.metadata?.title || `NFT #${nft.nftId}`}
                                </h3>
                                <div className="text-xs text-gray-600">
                                  #{nft.tokenId}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {nfts.length === 0 && !nftsLoading && (
                        <div className="text-center py-8 text-xs text-gray-600">
                          {dict?.nfts?.noNftsFound}
                        </div>
                      )}
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            ) : (
              <div className="stamp-spots p-4 w-full h-full">
                <div className="stamp-content-wrapper">
                  <div className="relative w-full h-full flex">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={"/images/hilos.png"}
                      draggable={false}
                      alt="Hilos"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTsEntry;
