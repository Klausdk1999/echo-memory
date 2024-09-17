import React from "react";
import { type Howl } from "howler";
import { cn } from "@/lib/utils"; // Utility class for conditional classnames
import Image from "next/image";

interface MemoryCardProps {
  id: number;
  parrot: string;
  isFlipped: boolean;
  handleClick: () => void;
  sound?: Howl; // path to the sound for this card
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  id,
  parrot,
  isFlipped,
  handleClick,
  sound,
}) => {
  const handleFlip = () => {
    if (sound) sound.play();
    handleClick();
  };

  return (
    <div
      key={id}
      className="perspective-1000 h-36 w-28"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(
          "transform-style-preserve-3d relative h-full w-full transition-transform duration-500 ease-in-out",
          {
            "rotate-y-180": isFlipped,
          },
        )}
      >
        <div
          className={cn(
            "absolute inset-0 px-2 flex items-center justify-center rounded-lg bg-white shadow-md",
            "backface-hidden",
          )}
        >
          <Image
            src="/media/front.png"
            alt="Frente da carta"
            className="h-full w-full object-contain p-2"
            width={100}
            height={150}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-lg bg-white shadow-md",
            "rotate-y-180 backface-hidden",
          )}
        >
          <Image
            src={`/media/${parrot}.gif`}
            alt={parrot}
            className="h-full w-full object-contain"
            width={100}
            height={150}
          />
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
