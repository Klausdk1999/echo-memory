"use client";
import React, { useState, useEffect, useCallback } from "react";
import MemoryCard from "./_components/card";
import { Howl } from "howler";
import VoiceCommand from "./_components/speech";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";

// Define types for the cards
export type MemoryCardType = {
  id: number;
  parrot: string;
  isFlipped: boolean;
};

// Define parrot names and sounds
const parrots: string[] = [
  "bobrossparrot",
  "explodyparrot",
  "fiestaparrot",
  "metalparrot",
  "revertitparrot",
  "tripletsparrot",
  "unicornparrot",
];

const winSound = new Howl({ src: ["/sounds/win.wav"] });
const loseSound = new Howl({ src: ["/sounds/lose.wav"] });

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC = () => {
  const [ncards, setNcards] = useState<number>(4);
  const [cards, setCards] = useState<MemoryCardType[]>([]);
  const [nClicks, setNClicks] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [previousCard, setPreviousCard] = useState<
    MemoryCardType | undefined
  >();

  useEffect(() => {
    if (ncards && ncards % 2 === 0) {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [ncards]);

  const playGameStartSound = () => {
    const startSound = new Howl({ src: ["/sounds/start.wav"] });
    startSound.play();
  };

  // Preload images for smoother flipping
  const preloadImages = (cards: MemoryCardType[]) => {
    cards.forEach((card) => {
      const img = new Image();
      img.src = `/media/${card.parrot}.gif`;
    });
  };

  const setupGame = useCallback(() => {
    const positions = shuffleArray([
      ...Array(ncards / 2).keys(),
      ...Array(ncards / 2).keys(),
    ]);

    const cardSet = positions.map((pos, i) => ({
      id: i,
      parrot: parrots[pos] ?? "defaultparrot",
      isFlipped: false,
    }));

    setCards(cardSet);
    setNClicks(0);
    setTimer(0);
    playGameStartSound();
    preloadImages(cardSet); // Preload images when the game is set up
  }, [ncards]);

  // Map parrots to sound objects
  const soundsMap = parrots.reduce(
    (map, parrot) => {
      map[parrot] = new Howl({ src: [`/sounds/flip.wav`] });
      return map;
    },
    {} as Record<string, Howl>,
  );

  const playSound = (parrot: string) => {
    const sound = soundsMap[parrot];
    if (sound) sound.play();
  };

  useEffect(() => {
    setupGame();
  }, [ncards, setupGame]);

  const handleCardClick = (card: MemoryCardType) => {
    if (previousCard?.id === card.id) return; // Prevent double-clicking the same card
    setNClicks((prev) => prev + 1);

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, isFlipped: !c.isFlipped } : c,
      ),
    );

    playSound(card.parrot); // Play flip sound on card click

    if (previousCard === undefined) {
      setPreviousCard(card);
    } else {
      if (previousCard.parrot === card.parrot) {
        setPreviousCard(undefined);
        winSound.play();
        setTimeout(() => checkWin(), 1000);
      } else {
        loseSound.play();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((mapCard) =>
              mapCard.parrot === previousCard.parrot ||
              mapCard.parrot === card.parrot
                ? { ...mapCard, isFlipped: false }
                : mapCard,
            ),
          );
          setPreviousCard(undefined);
        }, 1000);
      }
    }
  };

  const checkWin = () => {
    if (cards.every((card) => card.isFlipped)) {
      winSound.play();
      alert(`You won in ${nClicks} clicks and ${timer} seconds!`);
      setCards([]);
      setupGame();
    }
  };

  return (
    <body className="bg-blue-100 p-8 md:px-[10%]">
      <div className="flex justify-center">
        <CardTitle className="mb-4 w-fit rounded-xl bg-blue-400 p-2 text-center text-4xl font-bold text-white shadow-md">
          Papagaios da Memória
        </CardTitle>
        <Badge className="text-l absolute right-0 top-0 m-4 w-[100px] justify-center bg-blue-950 p-2 text-center text-white">
          {timer} segundos
        </Badge>
      </div>

      <div className="my-4 flex flex-col justify-center gap-4 md:flex-row">
        <VoiceCommand
          startGame={setupGame}
          selectCard={handleCardClick}
          selectNumberOfCards={setNcards}
        />
        <Button
          onClick={() => setNcards(4)}
          className="rounded-lg bg-green-600 p-3 shadow-md"
        >
          4 Cartas
        </Button>
        <Button
          onClick={() => setNcards(6)}
          className="rounded-lg bg-green-600 p-3 shadow-md"
        >
          6 Cartas
        </Button>
        <Button
          onClick={() => setNcards(8)}
          className="rounded-lg bg-green-600 p-3 shadow-md"
        >
          8 Cartas
        </Button>
      </div>
      <div
        className={`align-items-center grid min-h-[150px] grid-cols-2 justify-items-center gap-4 rounded-lg border-4 border-slate-200 bg-slate-50 p-6 shadow-md md:grid-cols-4`}
      >
        {cards.map((card, index) => (
          <MemoryCard
            key={index}
            id={card.id}
            parrot={card.parrot}
            isFlipped={card.isFlipped}
            handleClick={() => handleCardClick(card)}
            sound={soundsMap[card.parrot]}
          />
        ))}
      </div>
    </body>
  );
};

export default MemoryGame;
