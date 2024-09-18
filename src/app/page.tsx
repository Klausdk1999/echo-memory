"use client";
import React, { useState, useEffect, useCallback, use, useMemo } from "react";
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
  "sailorparrot",
  "tripletsparrot",
  "unicornparrot",
];

const victorySound = new Howl({ src: ["/sounds/victory.mp3"] });
const winSound = new Howl({ src: ["/sounds/win.wav"] });
const loseSound = new Howl({ src: ["/sounds/lose.wav"] });

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC = () => {
  const [ncards, setNcards] = useState<number>();
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

  const preloadImages = (cards: MemoryCardType[]) => {
    cards.forEach((card) => {
      const img = new Image();
      img.src = `/media/${card.parrot}.gif`;
    });
  };

  const setupGame = useCallback(() => {
    if (!ncards) return;
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
    preloadImages(cardSet);
  }, [ncards]);

  const soundsMap = parrots.reduce(
    (map, parrot) => {
      map[parrot] = new Howl({ src: [`/sounds/parrots/${parrot}.mp3`] });
      return map;
    },
    {} as Record<string, Howl>,
  );

  const playSound = (parrot: string) => {
    const sound = soundsMap[parrot];
    if (sound) {
      sound.fade(1, 0, 4500);

      sound.play();
      setTimeout(() => sound.stop(), 4000);
    }
  };

  useEffect(() => {
    setupGame();
  }, [ncards, setupGame]);

  const handleCardClick = (card: MemoryCardType) => {
    console.log(card.parrot, "atual");
    if (previousCard?.id === card.id) return;
    setNClicks((prev) => prev + 1);

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, isFlipped: !c.isFlipped } : c,
      ),
    );

    playSound(card.parrot);
    console.log(previousCard, card);
    if (previousCard === undefined) {
      setPreviousCard(card);
    } else {
      console.log(previousCard.parrot, card.parrot);
      if (previousCard.parrot === card.parrot) {
        setPreviousCard(undefined);
        winSound.play();
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
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (ncards && cards.length > 0) {
      if (cards.every((card) => card.isFlipped)) {
        setTimeout(() => {
          victorySound.play();
          alert(`Voce ganhou em ${nClicks} clicks e ${timer} segundos!`);
          setCards([]);
          setNcards(undefined);
          setupGame();
        }, 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const flipCardByIndex = (i: number) => {
    const selectedCard = cards[i];
    if (!selectedCard) return;
    handleCardClick(selectedCard);
  };

  const extractCardNumber = (command: string): number | null => {
    const match = /\d+/.exec(command); // Extract any digits from the string
    return match ? parseInt(match[0], 10) - 1 : null; // Return zero-indexed card number
  };

  const handleVoiceCommand = (command: string) => {
    console.log("Comando de voz:", command);
    const lowerCommand = command.toLowerCase();
    const cardNumber = extractCardNumber(lowerCommand);
    console.log(cards);
    switch (true) {
      // Match "virar cartão", "tirar cartão", "virar carta", and "tirar carta"
      case /virar (cartão|carta)|tirar (cartão|carta)/.test(lowerCommand): {
        if (cardNumber === undefined) break;
        const selectedCard = cards[cardNumber ?? 0];
        if (!selectedCard) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        handleCardClick(selectedCard);

        break;
      }
      case /iniciar|jogar|começar/.test(lowerCommand):
        setNcards(4);
        break;
      case /quatro cartas|4 cartas/.test(lowerCommand):
        setNcards(4);
        break;
      case /seis cartas|6 cartas/.test(lowerCommand):
        setNcards(6);
        break;
      case /oito cartas|8 cartas/.test(lowerCommand):
        setNcards(8);
        break;
      case /quatorze cartas|14 cartas|catorze cartas/.test(lowerCommand):
        setNcards(14);
        break;

      default:
        console.log(`Comando desconhecido: ${command}`);
        break;
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
          key={cards.length + JSON.stringify(previousCard)}
          handleVoiceCommand={handleVoiceCommand}
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
        <Button
          onClick={() => setNcards(14)}
          className="rounded-lg bg-green-600 p-3 shadow-md"
        >
          14 Cartas
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
          />
        ))}
      </div>
    </body>
  );
};

export default MemoryGame;
