"use client";

import Image from "next/image";
import { FunctionComponent, JSX, useContext } from "react";
import useMint from "../hooks/useMint";
import { useAccount } from "wagmi";
import { ModalContext } from "@/app/providers";

const Notice: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const { mintLoading, handleMint } = useMint(dict);

  return (
    <div className="relative w-full h-full flex-col gap-2 flex items-center justify-center">
      <div className="relative w-full sm:w-fit h-fit flex items-center justify-center">
        <div className="relative w-80 h-96 flex">
          <div className="stamp-border">
            <div className="stamp-content-wrapper overflow-y-scroll">
              <div className="stamp-grid-background"></div>
              <div className="stamp-content w-full flex flex-col text-black">
                <div className="relative w-full h-fit flex justify-start items-start font-rou text-4xl text-left">
                  {dict?.notice.paragraph5}
                </div>

                <button
                  onClick={handleMint}
                  disabled={
                    mintLoading ||
                    !address ||
                    Number(context?.verified?.minted) > 0
                  }
                  className="relative w-full mt-4 py-2 px-4 bg-black disabled:bg-gray-400 text-white rounded transition-all cursor-pointer"
                >
                  {Number(context?.verified?.minted) > 0
                    ? `${dict?.entry.balance} ${Number(
                        context?.verified?.minted
                      )}`
                    : mintLoading
                    ? `${dict?.entry.minting}`
                    : `${dict?.entry.mintIonic}`}
                </button>

                <div className="relative w-full h-56 flex">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={"/images/cateye.png"}
                    draggable={false}
                    alt="Cat Eye"
                  />
                </div>
                <div className="relative w-full h-fit flex justify-start items-start font-brass text-sm text-left">
                  {dict?.notice.paragraph1}
                </div>
                <div className="relative w-full h-40 flex">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={"/images/cows.png"}
                    draggable={false}
                    alt="Cat Eye"
                  />
                </div>
                <div className="relative text-black w-full h-fit flex text-justify justify-start items-start font-aza">
                  {dict?.notice.paragraph2}
                  <br />
                  <br />
                  {dict?.notice.paragraph3}
                  <br />
                  <br />
                  {dict?.notice.paragraph4}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
