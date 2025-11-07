"use client";

import Image from "next/image";
import { STICKERS } from "@/app/lib/constants";
import { FallingImage } from "../types/common.types";

export const FallingImagesContainer = ({
  images,
}: {
  images: FallingImage[];
}) => {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {images.map((img) => (
          <div
            key={img.id}
            className="fixed"
            style={{
              left: `${img.x}px`,
              top: `${img.y}px`,
              animation: "fall 3s linear forwards",
            }}
          >
            <Image
              draggable={false}
              src={`/images/${STICKERS[img.imageIndex]}`}
              alt="falling"
              width={100}
              height={100}
              style={{
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
              }}
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};
