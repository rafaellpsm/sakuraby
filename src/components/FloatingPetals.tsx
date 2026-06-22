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
}

const petalImages = [
  "/images/petalasmaisescuras.png",
  "/images/petalas-rosa.png",
  "/images/petalas-cereja.png",
];

function createPetal(id: number): Petal {
  return {
    id,
    left: (id * 37 + 13) % 100,
    size: (id % 3) * 10 + 20,
    duration: (id % 7) * 2 + 12,
    delay: (id % 5) * 1.5,
    swayAmount: (id % 4) * 15 + 20,
    opacity: (id % 4) * 0.05 + 0.15,
    imageIndex: id % 3,
  };
}

export default function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => createPetal(i));
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
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}
