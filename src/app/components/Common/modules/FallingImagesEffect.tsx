"use client";

import { useEffect } from "react";
import { useFallingImages } from "../hooks/useFallingImages";
import { FallingImagesContainer } from "./FallingImagesContainer";

export const FallingImagesEffect = () => {
  const { images, addFallingImage } = useFallingImages();
  const lastTimeRef = { current: 0 };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current > 100) {
        addFallingImage(e.clientX, e.clientY);
        lastTimeRef.current = now;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current > 100) {
        if (e.touches.length > 0) {
          addFallingImage(e.touches[0].clientX, e.touches[0].clientY);
          lastTimeRef.current = now;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [addFallingImage]);

  return <FallingImagesContainer images={images} />;
};