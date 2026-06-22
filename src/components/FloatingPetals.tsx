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
  imageIndex: number;
  rotation: number;
}

const petalImages = [
  "/images/petala-grande.png",
  "/images/petalasmaisescuras.png",
  "/images/petalas-cereja.png",
  "/images/petalas-rosa.png",
];

function createPetal(id: number): Petal {
  const seed = (id * 7919 + 104729) % 100000;
  return {
    id,
    left: seed % 100,
    size: (seed % 4) * 12 + 24,
    duration: (seed % 6) * 3 + 10,
    delay: (seed % 8) * 0.8,
    swayAmount: (seed % 5) * 12 + 25,
    opacity: (seed % 5) * 0.06 + 0.18,
    imageIndex: id % 4,
    rotation: seed % 360,
  };
}

export default function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => createPetal(i));
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
            <Image
              src={petalImages[petal.imageIndex]}
              alt=""
              width={petal.size}
              height={petal.size}
              className="object-contain"
              style={{ transform: `rotate(${petal.rotation}deg)` }}
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}
