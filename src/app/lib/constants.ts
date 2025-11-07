import { CoreContractAddresses } from "../components/Common/types/common.types";

export const LOCALES: string[] = ["en", "es"];

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";

export const NETWORKS = {
  LENS_TESTNET: {
    chainId: 37111,
    name: "Lens Network Testnet",
    rpcUrl: "https://rpc.testnet.lens.dev",
    blockExplorer: "https://block-explorer.testnet.lens.dev",
  },
  LENS_MAINNET: {
    chainId: 232,
    name: "Lens Network",
    rpcUrl: "https://rpc.lens.dev",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  process.env.NODE_ENV === "production"
    ? NETWORKS.LENS_MAINNET
    : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  return isMainnet ? NETWORKS.LENS_MAINNET : NETWORKS.LENS_TESTNET;
};

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    appraisals: "0x",
    designers: "0x",
    conductors: "0x",
    reactionPacks: "0x",
    ionic: "0x",
    mona: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    appraisals: "0x",
    designers: "0x",
    conductors: "0x",
    reactionPacks: "0x",
    ionic: "0x8E2318511fFCc846EA646902a8cb8326F4d07E56",
    mona: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
  },
};

export const getCoreContractAddresses = (
  chainId: number
): CoreContractAddresses => {
  const addresses = CORE_CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(
      `Core contract addresses not found for chain ID: ${chainId}`
    );
  }
  return addresses;
};

export const EMOJIS: string[] = ["😍", "👍", "👎", "🔥", "💎", "🤔"];

export const STICKERS: string[] = [
  "agent.png",
  "agent1.png",
  "chat.png",
  "chicita.png",
  "deeb3.png",
  "deepseek.png",
  "digi1.png",
  "digitalax.png",
  "dog.png",
  "fire.png",
  "flower.png",
  "fresa.png",
  "livenerd.png",
  "man.png",
  "smile.png",
  "smile2.png",
  "smile3.png",
  "space.png",
  "vitalik1.png",
  "vitalik2.png",
  "web3fashion.png",
];
