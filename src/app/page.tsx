"use client";
import React, { useState } from "react";
import StartScreen from "./_components/startScreen";
import MemoryGame from "./_components/game";

const Base: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <body className="bg-blue-100 p-8 md:px-[10%]">
      {gameStarted ? (
        <MemoryGame />
      ) : (
        <StartScreen onStart={() => setGameStarted(true)} />
      )}
    </body>
  );
};

export default Base;
