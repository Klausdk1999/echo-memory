"use client";
import React, { useEffect, useState } from "react";
import { startSound } from "./sounds";

interface StartScreenProps {
  onStart: () => void;
}
const playGameStartSound = () => {
  startSound.volume(0.3);
  startSound.play();
};
const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleKeyPress = () => {
      setHidden(true);
      playGameStartSound();

      onStart();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleKeyPress);
    };
  }, [onStart]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-800 to-green-800 text-white transition-transform duration-700 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <h1 className="pb-10 text-4xl font-bold">Jogo Papagaios da Memória</h1>
      <h1 className="animate-pulse text-2xl font-bold">
        Aperte qualquer tecla para iniciar
      </h1>
    </div>
  );
};

export default StartScreen;
