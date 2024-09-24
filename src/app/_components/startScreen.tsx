"use client";
import React, { useEffect, useState } from "react";

interface StartScreenProps {
  onStart: () => void;
}
const playGameStartSound = () => {
  const startSound = new Howl({ src: ["/sounds/start.wav"] });
  startSound.play();
};
const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [hidden, setHidden] = useState(false);

  const handleKeyPress = () => {
    setHidden(true);
    playGameStartSound();

    onStart();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-blue-900 text-white transition-transform duration-700 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <h1 className="pb-4 text-2xl font-bold">Jogo Papagaios da Memória</h1>
      <h1 className="text-4xl font-bold">Aperte qualquer tecla para iniciar</h1>
    </div>
  );
};

export default StartScreen;
