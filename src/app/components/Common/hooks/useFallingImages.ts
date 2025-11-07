import { STICKERS } from "@/app/lib/constants";
import { useState, useCallback, useRef, useEffect } from "react";
import { FallingImage } from "../types/common.types";


export const useFallingImages = () => {
  const [images, setImages] = useState<FallingImage[]>([]);
  const idCounterRef = useRef(0);

  const addFallingImage = useCallback((x: number, y: number) => {
    const randomImageIndex = Math.floor(Math.random() * STICKERS.length);
    const newImage: FallingImage = {
      id: `falling-${idCounterRef.current++}`,
      x,
      y,
      imageIndex: randomImageIndex,
    };

    setImages((prev) => [...prev, newImage]);

    setTimeout(() => {
      setImages((prev) => prev.filter((img) => img.id !== newImage.id));
    }, 3000);
  }, []);

  return {
    images,
    addFallingImage,
  };
};