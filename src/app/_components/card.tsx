import React from "react";
import { Howl } from "howler";

interface CardProps {
  id: number;
  parrot: string;
  isFlipped: boolean;
  handleClick: () => void;
  sound?: string; // path to the sound for this card
}

const Card: React.FC<CardProps> = ({
  id,
  parrot,
  isFlipped,
  handleClick,
  sound,
}) => {
  const playSound = () => {
    if (!sound) return;
    const soundFile = new Howl({ src: [sound] });
    soundFile.play();
  };

  const handleFlip = () => {
    playSound();
    handleClick();
  };

  return (
    <div
      className={`card h-36 w-24 transform cursor-pointer rounded-lg bg-white shadow-md ${isFlipped ? "flipped" : ""}`}
      onClick={handleFlip}
    >
      <div className={`face relative h-full w-full`}>
        {isFlipped ? (
          <img
            src={`/media/${parrot}.gif`}
            alt={parrot}
            className="absolute h-full w-full"
          />
        ) : (
          <img
            src="/media/front.png"
            alt="Parrot Front"
            className="absolute h-full w-full p-2"
          />
        )}
      </div>
    </div>
  );
};

export default Card;
