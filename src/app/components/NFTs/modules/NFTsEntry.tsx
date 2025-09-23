"use client";

import { FunctionComponent, JSX, useState } from "react";
import useNFTs from "../hooks/useNFTs";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TokenType } from "../types/nfts.types";

const NFTsEntry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { nfts, nftsLoading, hasMoreNfts, loadMoreNfts, handleSubmitNFT, submitLoading, formData, setFormData } = useNFTs();
  const router = useRouter();
  const [showSubmitForm, setShowSubmitForm] = useState<boolean>(false);

  return (
    <div className="w-full max-w-6xl mx-auto font-blocks p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">{dict?.nfts?.title}</h1>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="px-3 py-1 text-xs bg-black text-white border border-black hover:bg-gray-900 transition-colors"
        >
          {showSubmitForm ? 'HIDE' : dict?.nfts?.submitNft}
        </button>
      </div>

      {showSubmitForm && (
        <div className="mb-6 border border-black p-3 bg-gray-50">
          <h2 className="text-sm font-medium mb-3">{dict?.nfts?.submitNewNft}</h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs mb-1">{dict?.nfts?.tokenAddress}</label>
              <input
                type="text"
                value={formData.tokenAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenAddress: e.target.value }))}
                placeholder={dict?.nfts?.tokenAddressPlaceholder}
                className="w-full p-1 text-xs border border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">{dict?.nfts?.tokenId}</label>
              <input
                type="number"
                value={formData.tokenId}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenId: parseInt(e.target.value) || 0 }))}
                placeholder={dict?.nfts?.tokenIdPlaceholder}
                className="w-full p-1 text-xs border border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">{dict?.nfts?.tokenType}</label>
              <select
                value={formData.tokenType}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenType: Number(e.target.value) }))}
                className="w-full p-1 text-xs border border-black focus:outline-none"
              >
                <option value={TokenType.ERC721}>ERC-721</option>
                <option value={TokenType.ERC1155}>ERC-1155</option>
                <option value={TokenType.ERC998}>ERC-998</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSubmitNFT}
                disabled={submitLoading || !formData.tokenAddress || !formData.tokenId}
                className="w-full px-2 py-1 text-xs bg-black text-white border border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitLoading ? dict?.nfts?.submitting : dict?.nfts?.submit}
              </button>
            </div>
          </form>
        </div>
      )}

      <div id="nfts-scroll" className="max-h-screen overflow-auto">
        <InfiniteScroll
          dataLength={nfts.length}
          next={loadMoreNfts}
          hasMore={hasMoreNfts}
          loader={
            <div className="text-center py-2 text-xs">
              {nftsLoading ? dict?.nfts?.loading : ""}
            </div>
          }
          scrollableTarget="nfts-scroll"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {nfts.map((nft) => (
              <div
                key={nft.nftId}
                className="border border-black hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={() => router.push(`/nft/${nft.nftContract}/${nft.nftId}`)}
              >
                <div className="space-y-1">
                  {nft.metadata?.image && (
                    <div className="w-full aspect-square relative">
                      <Image
                        fill
                        draggable={false}
                        src={nft.metadata.image}
                        alt={nft.metadata.title || "NFT"}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-2">
                    <h3 className="text-xs font-medium line-clamp-1">
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
            <div className="col-span-full text-center py-8 text-xs text-gray-600">
              {dict?.nfts?.noNftsFound}
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default NFTsEntry;
