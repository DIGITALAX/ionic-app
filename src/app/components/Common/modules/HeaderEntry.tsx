"use client";

import { FunctionComponent, JSX, useCallback } from "react";
import useHeader from "../hooks/useHeader";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeaderEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { isConnected } = useHeader();
  const router = useRouter();
  const handleReset = useCallback(() => {
    window.dispatchEvent(new CustomEvent("resetStickers"));
  }, []);
  return (
    <div className="relative top-0 left-0 right-0 z-50 text-xxs">
      <div className="flex items-center justify-center sm:justify-between sm:gap-0 gap-3 py-2 px-2 sm:px-6 h-fit sm:h-16 flex-wrap">
        <div className="relative w-fit h-fit flex gap-2 justify-center items-center flex-row">
          <div className="relative w-fit h-fit flex">
            <div
              className="relative cursor-pointer w-7 h-7 flex"
              onClick={handleReset}
            >
              <div className="relative w-full h-full flex">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src={"/images/reset.png"}
                  draggable={false}
                  alt="Reset"
                />
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="tracking-wide text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.ionic}
          </Link>
        </div>

        <nav className="flex justify-center items-center gap-2 sm:gap-8 flex-wrap">
          <button
            onClick={() => router.push("/nfts")}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.nfts}
          </button>
          <button
            onClick={() => router.push("/market")}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.market}
          </button>
          <button
            onClick={() => router.push("/about")}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {dict?.header?.about}
          </button>
          {isConnected && (
            <button
              onClick={() => router.push("/account")}
              className="text-white hover:opacity-70 transition-opacity"
            >
              {dict?.header?.account}
            </button>
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
