"use client";

import { FunctionComponent, JSX } from "react";
import useHeader from "../hooks/useHeader";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { getCurrentNetwork } from "@/app/lib/constants";
import { useRouter } from "next/navigation";

const HeaderEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { isConnected } = useHeader();
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 text-xxs">
      <div className="flex items-center justify-center sm:justify-between sm:gap-0 gap-3 py-2 px-2 sm:px-6 h-fit sm:h-16 flex-wrap">
        <Link
          href="/"
          className="tracking-wide text-white hover:opacity-70 transition-opacity"
        >
          {dict?.header?.ionic}
        </Link>

        <nav className="flex justify-center items-center gap-2 sm:gap-8 flex-wrap">
          <div
            // onClick={() => router.push("/nfts")}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.nfts}
          </div>
          <div
            // onClick={() => router.push("/market")}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.market}
          </div>
          <div
            // onClick={() => router.push("/about")}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.about}
          </div>
          {isConnected && (
            <div
              // onClick={() => router.push("/account")}
              className="text-white hover:opacity-70 transition-opacity"
            >
              {dict?.header?.account}
            </div>
          )}

          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress }) => {
              return (
                <button
                  onClick={show}
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  {isConnected ? truncatedAddress : dict?.header?.connect}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </nav>
      </div>
    </div>
  );
};

export default HeaderEntry;
