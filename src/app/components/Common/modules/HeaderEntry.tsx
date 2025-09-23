"use client";

import { FunctionComponent, JSX } from "react";
import useHeader from "../hooks/useHeader";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { getCurrentNetwork } from "@/app/lib/constants";

const HeaderEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { isConnected } = useHeader();
  const network = getCurrentNetwork();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black text-xxs">
      <div className="flex items-center justify-center sm:justify-between sm:gap-0 gap-3 py-2 px-2 sm:px-6 h-fit sm:h-16 flex-wrap">
        <Link
          href="/"
          className="tracking-wide text-black hover:opacity-70 transition-opacity"
        >
          {dict?.header?.ionic}
        </Link>

        <nav className="flex justify-center items-center gap-2 sm:gap-8 flex-wrap">
          <Link
            href="/nfts"
            className="text-black hover:opacity-70 transition-opacity"
          >
            {dict?.header?.nfts}
          </Link>
          <Link
            href="/market"
            className="text-black hover:opacity-70 transition-opacity"
          >
            {dict?.header?.market}
          </Link>
          <Link
            href="/about"
            className="text-black hover:opacity-70 transition-opacity"
          >
            {dict?.header?.about}
          </Link>
          {isConnected && (
            <Link
              href="/account"
              className="text-black hover:opacity-70 transition-opacity"
            >
              {dict?.header?.account}
            </Link>
          )}

          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress }) => {
              return (
                <button
                  onClick={show}
                  className="px-2 sm:px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors"
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
