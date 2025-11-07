"use client";

import { FallingImagesEffect } from "./FallingImagesEffect";
import { InfiniteRainContainer } from "./InfiniteRainContainer";
import { useInfiniteRain } from "../hooks/useInfiniteRain";

export const AllEffectsContainer = () => {
  const { rainingImages, bottomImages, removeBottomImage } = useInfiniteRain();

  return (
    <>
      <FallingImagesEffect />
      <InfiniteRainContainer
        rainingImages={rainingImages}
        bottomImages={bottomImages}
        removeBottomImage={removeBottomImage}
      />
    </>
  );
};