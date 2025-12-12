import { INFURA_GATEWAY } from "./constants";
import { PublicClient } from "viem";
import { TokenType } from "@/app/components/NFTs/types/nfts.types";
import { fetchNFTMetadata } from "./helpers/metadata";

export const ensureMetadata = async (item: any) => {
  if (!item?.metadata && item?.uri) {
    const ipfsMetadata = await fetchMetadataFromIPFS(item?.uri);
    item.metadata = ipfsMetadata;
  }
  return item;
};

export const fetchMetadataFromIPFS = async (uri: string): Promise<any> => {
  try {
    let metadataUrl = uri;

    if (uri?.startsWith("ipfs://")) {
      metadataUrl = `${INFURA_GATEWAY}/ipfs/${uri.split("ipfs://")[1]}`;
    } else if (!uri?.startsWith("http://") && !uri?.startsWith("https://")) {
      return null;
    }

    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    return null;
  }
};

export const fetchMetadata = async (
  nfts: any[],
  publicClient: PublicClient
): Promise<any[]> => {
  return Promise.all(
    nfts.map(async (nft) => {
      try {
        let tokenUri = nft?.uri;
        if (publicClient && nft?.nftContract && nft?.nftId) {
          tokenUri = await resolveTokenUri(
            publicClient,
            nft.nftContract,
            nft.nftId,
            nft.tokenType
          );
        }
        if (tokenUri) {
          const metadata = await fetchNFTMetadata(tokenUri);
          return { ...nft, metadata, uri: tokenUri };
        }

        return nft;
      } catch (error) {
        return nft;
      }
    })
  );
};

export const resolveTokenUri = async (
  publicClient: PublicClient,
  contractAddress: string,
  tokenId: string | number,
  tokenType: TokenType
): Promise<string | null> => {
  try {
    let uri: string | null = null;

    if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
      uri = (await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            name: "tokenURI",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "tokenId", type: "uint256" }],
            outputs: [{ name: "uri", type: "string" }],
          },
        ],
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      })) as string;
    } else if (tokenType === TokenType.ERC1155) {
      uri = (await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            name: "uri",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "id", type: "uint256" }],
            outputs: [{ name: "uri", type: "string" }],
          },
        ],
        functionName: "uri",
        args: [BigInt(tokenId)],
      })) as string;

      if (uri && uri.includes("{id}")) {
        uri = uri.replace("{id}", tokenId.toString());
      }
    }

    if (!uri) return null;

    if (uri.startsWith("ipfs://")) {
      return `${INFURA_GATEWAY}/ipfs/${uri.split("ipfs://")[1]}`;
    }

    return uri;
  } catch (error) {
    return null;
  }
};
