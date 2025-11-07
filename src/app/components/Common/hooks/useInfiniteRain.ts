import { STICKERS } from "@/app/lib/constants";
import { useState, useCallback, useRef, useEffect } from "react";
import { RainingImage } from "../types/common.types";

export const useInfiniteRain = () => {
  const [rainingImages, setRainingImages] = useState<RainingImage[]>([]);
  const [bottomImages, setBottomImages] = useState<RainingImage[]>([]);
  const idCounterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomImageIndex = Math.floor(Math.random() * STICKERS.length);
      const randomX = Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000);

      const newImage: RainingImage = {
        id: `rain-${idCounterRef.current++}`,
        x: randomX,
        imageIndex: randomImageIndex,
        isInBottomRow: false,
      };

      setRainingImages((prev) => [...prev, newImage]);

      setTimeout(() => {
        setRainingImages((prev) => prev.filter((img) => img.id !== newImage.id));

        const bottomImage: RainingImage = {
          ...newImage,
          isInBottomRow: true,
        };

        setBottomImages((prev) => [...prev, bottomImage]);
      }, 3000);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const removeBottomImage = useCallback((id: string) => {
    setBottomImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  return {
    rainingImages,
    bottomImages,
    removeBottomImage,
  };
};