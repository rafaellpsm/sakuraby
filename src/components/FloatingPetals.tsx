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
    size: (seed % 4) * 12 + 35,
    duration: (seed % 5) * 4 + 12,
    delay: (seed % 8) * 1.2,
    swayAmount: (seed % 4) * 20 + 30,
    opacity: (seed % 4) * 0.08 + 0.3,
    rotation: seed % 360,
    isEmoji: id % 5 === 0,
  };
}

export default function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => createPetal(i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
