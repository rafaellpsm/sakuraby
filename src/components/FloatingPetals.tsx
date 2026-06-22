"use client";

import { useMemo } from "react";
import Image from "next/image";

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
  opacity: number;
  rotation: number;
  isEmoji: boolean;
}

function createPetal(id: number): Petal {
  const seed = (id * 7919 + 104729) % 100000;
  return {
    id,
    left: seed % 100,
    size: (seed % 3) * 12 + 28,
    duration: (seed % 4) * 4 + 12,
    delay: (seed % 6) * 1.5,
    swayAmount: (seed % 3) * 20 + 25,
    opacity: (seed % 4) * 0.08 + 0.2,
    rotation: seed % 360,
    isEmoji: id % 3 === 0,
  };
}

export default function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => createPetal(i));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${petal.left}%`,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <div
            className="animate-petal-sway"
            style={{
              animationDuration: `${petal.duration * 0.6}s`,
              "--sway": `${petal.swayAmount}px`,
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
        </div>
      ))}
    </div>
  );
}
