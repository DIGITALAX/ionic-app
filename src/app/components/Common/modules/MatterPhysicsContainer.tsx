"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Image from "next/image";
import { STICKERS } from "@/app/lib/constants";
import { FallingImageBody } from "../types/common.types";

interface BodyWithZIndex extends FallingImageBody {
  zIndex: number;
}

export const MatterPhysicsContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesToRenderRef = useRef<BodyWithZIndex[]>([]);
  const [bodies, setBodies] = useState<BodyWithZIndex[]>([]);
  const idCounterRef = useRef(0);
  const maxHeightRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const engine = Engine.create();
    engineRef.current = engine;

    engine.world.gravity.y = 1;

    const ground = Bodies.rectangle(width / 2, height + 10, width, 20, {
      isStatic: true,
    });

    const leftWall = Bodies.rectangle(-20, height / 2, 40, height, {
      isStatic: true,
    });

    const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height, {
      isStatic: true,
    });

    World.add(engine.world, [ground, leftWall, rightWall]);

    const createFallingImage = (x: number) => {
      const imageIndex = Math.floor(Math.random() * STICKERS.length);
      const body = Bodies.circle(x, -30, 20, {
        restitution: 0.3,
        friction: 0.8,
        frictionAir: 0.02,
        density: 0.001,
      });

      const heightThreshold = height * 0.5;
      const zIndex = maxHeightRef.current >= heightThreshold ? 0 : 10000;

      const fallingImage: BodyWithZIndex = {
        body,
        imageIndex,
        id: `matter-${idCounterRef.current++}`,
        zIndex,
      };

      World.add(engine.world, body);
      bodiesToRenderRef.current.push(fallingImage);
    };

    const handleReset = () => {
      bodiesToRenderRef.current.forEach((item) => {
        World.remove(engine.world, item.body);
      });
      bodiesToRenderRef.current = [];
      setBodies([]);
      maxHeightRef.current = 0;
    };

    window.addEventListener("resetStickers", handleReset);

    const rainInterval = setInterval(() => {
      const randomX = Math.random() * width;
      createFallingImage(randomX);
    }, 150);

    const renderLoop = setInterval(() => {
      Engine.update(engine, 1000 / 60);

      const visibleBodies = bodiesToRenderRef.current.filter((item) => {
        return item.body.position.y < height + 50;
      });

      bodiesToRenderRef.current = visibleBodies;

      if (visibleBodies.length > 0) {
        const minY = Math.min(...visibleBodies.map((item) => item.body.position.y));
        maxHeightRef.current = height - minY;
        const heightThreshold = height * 0.5;
        const isOverThreshold = maxHeightRef.current >= heightThreshold;

        visibleBodies.forEach((item) => {
          const idNumber = parseInt(item.id.split('-')[1]);
          if (isOverThreshold) {
            item.zIndex = idNumber;
          } else {
            item.zIndex = 10000 + idNumber;
          }
        });
      } else {
        maxHeightRef.current = 0;
      }

      setBodies([...visibleBodies]);
    }, 1000 / 60);

    return () => {
      clearInterval(rainInterval);
      clearInterval(renderLoop);
      World.clear(engine.world, true);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
    >
      {bodies.map((item) => (
        <div
          key={item.id}
          className="fixed"
          style={{
            left: `${item.body.position.x - 20}px`,
            top: `${item.body.position.y - 20}px`,
            transform: `rotate(${item.body.angle}rad)`,
            zIndex: item.zIndex,
          }}
        >
          <Image
            draggable={false}
            src={`/images/${STICKERS[item.imageIndex]}`}
            alt="falling"
            width={40}
            height={40}
            style={{
              filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
            }}
          />
        </div>
      ))}
    </div>
  );
};
