"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { STICKERS } from "@/app/lib/constants";
import { RainingImage } from "../types/common.types";

export const InfiniteRainContainer = ({
  rainingImages,
  bottomImages,
  removeBottomImage,
}: {
  rainingImages: RainingImage[];
  bottomImages: RainingImage[];
  removeBottomImage: (id: string) => void;
}) => {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const getStackHeightForX = (x: number, currentIndex: number) => {
    const tolerance = 50;
    let stackHeight = 0;

    for (let i = 0; i < currentIndex; i++) {
      const otherImage = bottomImages[i];
      if (Math.abs(otherImage.x - x) < tolerance) {
        stackHeight += 45;
      }
    }

    return stackHeight;
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {rainingImages.map((img) => (
          <div
            key={img.id}
            className="fixed"
            style={{
              left: `${img.x}px`,
              top: "0px",
              animation: "rainFall 3s linear forwards",
            }}
          >
            <Image
              draggable={false}
              src={`/images/${STICKERS[img.imageIndex]}`}
              alt="raining"
              width={40}
              height={40}
              style={{
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
              }}
            />
          </div>
        ))}

        {bottomImages.map((img, index) => {
          const stackHeight = getStackHeightForX(img.x, index);

          return (
            <div
              key={img.id}
              className="fixed cursor-pointer hover:opacity-75 transition-opacity pointer-events-auto"
              style={{
                left: `${img.x}px`,
                bottom: `${stackHeight}px`,
              }}
              onClick={() => removeBottomImage(img.id)}
              title="Click to remove"
            >
              <Image
                draggable={false}
                src={`/images/${STICKERS[img.imageIndex]}`}
                alt="collected"
                width={40}
                height={40}
                style={{
                  filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
                }}
              />
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes rainFall {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            transform: translateY(${windowHeight ? windowHeight - 50 : 750}px);
          }
        }
      `}</style>
    </>
  );
};
