"use client";

import Image from "next/image";
import { FunctionComponent, JSX, useCallback } from "react";

const Notice: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const handleReset = useCallback(() => {
    window.dispatchEvent(new CustomEvent("resetStickers"));
  }, []);

  return (
    <div className="relative w-full h-full flex-col gap-2 flex items-center justify-center">
      <div className="relative w-fit h-fit flex">
        <div
          className="relative cursor-pointer bg-white/80 p-1 border border-black hover:opacity-90 w-8 h-8 flex rounded-full"
          onClick={handleReset}
        >
          <div className="relative w-full h-full flex">
            <Image
              layout="fill"
              className="rounded-full"
              objectFit="contain"
              src={"/images/reset.png"}
              draggable={false}
              alt="Reset"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .stamp-border {
          --radius: 5px;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
              var(--radius),
              transparent 98%,
              #ffffff
            ),
            linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%);
          background-repeat: round, no-repeat;
          background-position: calc(var(--radius) * -1.5)
              calc(var(--radius) * -1.5),
            50%;
          background-size: calc(var(--radius) * 3) calc(var(--radius) * 3),
            calc(100% - var(--radius) * 3) calc(100% - var(--radius) * 3);
          padding: calc(var(--radius) * 1.5);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .stamp-content-wrapper {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          position: relative;
          text-align: center;
        }

        .stamp-grid-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(
              0deg,
              transparent 24%,
              rgba(100, 150, 200, 0.08) 25%,
              rgba(100, 150, 200, 0.08) 26%,
              transparent 27%
            ),
            linear-gradient(
              90deg,
              transparent 24%,
              rgba(100, 150, 200, 0.08) 25%,
              rgba(100, 150, 200, 0.08) 26%,
              transparent 27%
            );
          background-size: 15px 15px;
          pointer-events: none;
        }

        .stamp-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex: 1;
        }

        .stamp-image {
          width: 70%;
          height: auto;
          max-height: 45%;
          object-fit: contain;
          filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
        }

        .stamp-text-wrapper {
          position: relative;
          z-index: 3;
        }

        .stamp-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e3a8a;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }

        .stamp-subtitle {
          font-size: 9px;
          color: #666;
          margin: 2px 0 0 0;
          font-family: monospace;
          letter-spacing: 0.2px;
        }

        .stamp-code {
          position: absolute;
          bottom: 8px;
          right: 8px;
          font-size: 20px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0;
          font-family: serif;
          opacity: 0.9;
          z-index: 3;
        }
      `}</style>
      <div className="relative w-full sm:w-fit h-fit flex items-center justify-center">
        <div className="relative w-80 h-96 flex">
          <div className="stamp-border">
            <div className="stamp-content-wrapper overflow-y-scroll">
              <div className="stamp-grid-background"></div>
              <div className="stamp-content w-full flex flex-col text-black">
                <div className="relative w-full h-fit flex justify-start items-start font-rou text-4xl text-left">
                  {dict.notice.paragraph5}
                </div>
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
                  {dict.notice.paragraph1}
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
                  {dict.notice.paragraph2}
                  <br />
                  <br />
                  {dict.notice.paragraph3}
                  <br />
                  <br />
                  {dict.notice.paragraph4}
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
