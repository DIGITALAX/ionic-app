"use client";
import { createContext, SetStateAction, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { chains } from "@lens-chain/sdk/viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentNetwork } from "./lib/constants";
import {
  Conductor,
  Designer,
  Reaction,
  Reviewer,
} from "./components/Common/types/common.types";
import { ErrorData, SuccessData } from "./components/Modals/types/modals.types";

const queryClient = new QueryClient();
const currentNetwork = getCurrentNetwork();

export const ModalContext = createContext<
  | {
      conductor: Conductor | undefined;
      setConductor: (e: SetStateAction<Conductor | undefined>) => void;
      userReactions: { count: number; reaction: Reaction }[];
      setUserReactions: (
        e: SetStateAction<{ count: number; reaction: Reaction }[]>
      ) => void;
      reviewer: Reviewer | undefined;
      setReviewer: (e: SetStateAction<Reviewer | undefined>) => void;
      verified: {
        minted: number;
        canMint: boolean;
      };
      setVerified: (
        e: SetStateAction<{
          minted: number;
          canMint: boolean;
        }>
      ) => void;
      designer: Designer | undefined;
      setDesigner: (e: SetStateAction<Designer | undefined>) => void;
      showSuccess: (message: string, txHash?: string) => void;
      showError: (message: string) => void;
      hideSuccess: () => void;
      hideError: () => void;
      successData: SuccessData | null;
      errorData: ErrorData | null;
    }
  | undefined
>(undefined);

export const config = createConfig(
  getDefaultConfig({
    appName: "Ionic",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://ionic.digitalax.xyz",
    appIcon: "https://ionic.digitalax.xyz/favicon.ico",
    chains: [chains.mainnet],
    connectors: [],
    transports: {
      [currentNetwork.chainId]: http(),
    },
    ssr: true,
  })
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [conductor, setConductor] = useState<Conductor | undefined>();
  const [reviewer, setReviewer] = useState<Reviewer | undefined>();
  const [userReactions, setUserReactions] = useState<
    { count: number; reaction: Reaction }[]
  >([]);
  const [verified, setVerified] = useState<{
    minted: number;
    canMint: boolean;
  }>({
    minted: 0,
    canMint: false,
  });
  const [designer, setDesigner] = useState<Designer | undefined>();
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  const showSuccess = (message: string, txHash?: string) => {
    setSuccessData({ message, txHash });
  };

  const showError = (message: string) => {
    setErrorData({ message });
  };

  const hideSuccess = () => {
    setSuccessData(null);
  };

  const hideError = () => {
    setErrorData(null);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Nerd Semi", cursive',
          }}
        >
          <ModalContext.Provider
            value={{
              designer,
              setDesigner,
              conductor,
              setConductor,
              reviewer,
              setReviewer,
              userReactions,
              setUserReactions,
              verified,
              setVerified,
              showSuccess,
              showError,
              hideSuccess,
              hideError,
              successData,
              errorData,
            }}
          >
            {children}
          </ModalContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
