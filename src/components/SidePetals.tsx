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
    top: (seed % 80) + 10,
    size: (seed % 3) * 20 + 50,
    duration: (seed % 4) * 2 + 5,
    delay: (seed % 6) * 1.5,
    opacity: (seed % 4) * 0.04 + 0.08,
    rotation: seed % 360,
    imageIndex: id % 4,
  };
}

export default function SidePetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => createSidePetal(i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden hidden md:block">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`absolute ${petal.side === "left" ? "animate-float" : "animate-float-reverse"}`}
          style={{
            [petal.side]: petal.side === "left" ? "-20px" : "-20px",
            top: `${petal.top}%`,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
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
