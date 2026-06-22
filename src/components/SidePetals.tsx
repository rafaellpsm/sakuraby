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
  imageIndex: number;
  drift: number;
}

const petalImages = [
  "/images/petala-grande.png",
  "/images/petalasmaisescuras.png",
  "/images/petalas-cereja.png",
  "/images/petalas-rosa.png",
];

function createSidePetal(id: number): SidePetal {
  const seed = (id * 3571 + 82949) % 100000;
  const side = id % 2 === 0 ? "left" : "right";
  return {
    id,
    side,
    top: (seed % 85) + 5,
    size: (seed % 4) * 18 + 45,
    duration: (seed % 5) * 2 + 4,
    delay: (seed % 7) * 1.2,
    opacity: (seed % 5) * 0.03 + 0.1,
    rotation: seed % 360,
    imageIndex: id % 4,
    drift: (seed % 3) * 15 + 20,
  };
}

export default function SidePetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => createSidePetal(i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden hidden md:block">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-drift"
          style={{
            [petal.side]: petal.side === "left" ? `-${petal.size / 2}px` : `-${petal.size / 2}px`,
            top: `${petal.top}%`,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            "--drift": `${petal.drift}px`,
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
      ))}
    </div>
  );
}
