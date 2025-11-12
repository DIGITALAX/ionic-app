import { NetworkConfig } from "../constants";

export const getExplorerUrl = (
  network: NetworkConfig,
  txHash: string,
  address?: boolean
) => {
  return `${network.blockExplorer}/${address ? "address" : "tx"}/${txHash}`;
};

export const formatAddress = (address: string) => {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
};

export const formatDate = (timestamp: string) => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
