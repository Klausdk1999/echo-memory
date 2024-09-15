"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "./_components/card";
import { Howl } from "howler";

type CardType = {
  id: number;
  parrot: string;
  isFlipped: boolean;
};

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
const sounds: string[] = parrots.map((parrot) => `/sounds/flip.wav`); // Add sound files in public/sounds /sounds/${parrot}.mp3

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC = () => {
  const [ncards, setNcards] = useState<number>(0);
  const [cards, setCards] = useState<CardType[]>([]);
  const [nClicks, setNClicks] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [previousCard, setPreviousCard] = useState<CardType>();

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
  }, [ncards]);

  useEffect(() => {
    setupGame();
  }, [ncards, setupGame]);

  const handleCardClick = (card: CardType) => {
    if (previousCard?.id === card.id) return;
    setNClicks((prev) => prev + 1);

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, isFlipped: !c.isFlipped } : c,
      ),
    );

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
    <section className="container mx-auto h-[100vh] w-full bg-green-100 p-8">
      <div className="flex justify-center">
        <h1 className="mb-4 w-fit rounded-xl border-4 border-green-600 bg-green-200 p-2 text-center text-4xl font-bold text-green-900">
          Papagaios da Memória
        </h1>
      </div>

      <p className="mb-4 text-center text-xl">Timer: {timer} segundos</p>
      <div
        className={`grid min-h-[150px] grid-cols-4 items-center justify-center gap-4 rounded-lg border-4 border-slate-200 bg-slate-50 p-6 shadow-md`}
      >
        {cards.map((card, index) => (
          <Card
            key={index}
            id={card.id}
            parrot={card.parrot}
            isFlipped={card.isFlipped}
            handleClick={() => handleCardClick(card)}
            sound={sounds[card.id]}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setNcards(4)}
          className="rounded-lg bg-green-300 p-3 shadow-md"
        >
          4 Cartas
        </button>
        <button
          onClick={() => setNcards(6)}
          className="rounded-lg bg-green-300 p-3 shadow-md"
        >
          6 Cartas
        </button>
        <button
          onClick={() => setNcards(8)}
          className="rounded-lg bg-green-300 p-3 shadow-md"
        >
          8 Cartas
        </button>
      </div>
    </section>
  );
};

export default MemoryGame;
