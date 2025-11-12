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
    rpcUrl: "https://rpc.lens.xyz",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  // process.env.NODE_ENV === "production"
  //   ? 
    NETWORKS.LENS_MAINNET
    // : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  // const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  const isMainnet = true;
  return isMainnet ? NETWORKS.LENS_MAINNET : NETWORKS.LENS_TESTNET;
};

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    appraisals: "0xd83Ce31575E465694bdcb8E3688B189a39f34eA7",
    designers: "0xb87C571737536F8A4F26da0ce6518ecfE9e92C6f",
    conductors: "0xC6CcCebF8c151f253d5AdCDE5bd3F09d4a75caaD",
    reactionPacks: "0x553bad5BeD228A5B96153Dd397DcE9e6F76B45C4",
    ionic: "0xb8CfdBEF2721C51d8cC76Cd0FaA6B9799bF05123",
    mona: "0x18921123f3457AD3c974f2edfCb1053FB29450AC",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    appraisals: "0x99a5E4AF49D13bfa45341D1a120A86a071a0D2ED",
    designers: "0x7867d89afc4197c4108AC658f29DdE31693c2873",
    conductors: "0x3DA267952b20b6a9953093b80b76d70ceF0C6A18",
    reactionPacks: "0xb33AF8B96aE53bE1B890faD0AA6e06A435e03c13",
    ionic: "0x160694488154F67c70208cBA1fa3dDb8B7FF8738",
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
