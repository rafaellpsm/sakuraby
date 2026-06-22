"use client";

import { useMemo } from "react";
import Image from "next/image";

interface SidePetal {
  id: number;
  side: "left" | "right";
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotation: number;
  drift: number;
  isEmoji: boolean;
}

function createSidePetal(id: number): SidePetal {
  const seed = (id * 3571 + 82949) % 100000;
  const side = id % 2 === 0 ? "left" : "right";
  return {
    id,
    side,
    top: (seed % 75) + 10,
    size: (seed % 4) * 25 + 70,
    duration: (seed % 4) * 3 + 6,
    delay: (seed % 6) * 2,
    opacity: (seed % 4) * 0.06 + 0.15,
    rotation: seed % 360,
    drift: (seed % 3) * 20 + 25,
    isEmoji: id % 4 === 0,
  };
}

export default function SidePetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => createSidePetal(i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden hidden lg:block">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-drift"
          style={{
            [petal.side]: petal.side === "left" ? "10px" : "10px",
            top: `${petal.top}%`,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            "--drift": `${petal.drift}px`,
          } as React.CSSProperties}
        >
          {petal.isEmoji ? (
            <span
              className="text-pink-300 select-none"
              style={{
                fontSize: `${petal.size}px`,
                transform: `rotate(${petal.rotation}deg)`,
                display: "block",
              }}
            >
              🌸
            </span>
          ) : (
            <Image
              src="/images/petala-grande.png"
              alt=""
              width={petal.size}
              height={petal.size}
              className="object-contain"
              style={{ transform: `rotate(${petal.rotation}deg)` }}
              unoptimized
            />
          )}
        </div>
      ))}
    </div>
  );
}
