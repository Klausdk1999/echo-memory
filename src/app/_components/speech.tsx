/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import type { MemoryCardType } from "./game";
import { loseSound, PlaySound, winSound } from "./sounds";
import { handleVoiceCommand } from "./voiceCommandts";

interface SpeechRecognitionProps {
  cards: MemoryCardType[];
  setCards: React.Dispatch<React.SetStateAction<MemoryCardType[]>>;
  previousCard: MemoryCardType | undefined;
  setPreviousCard: React.Dispatch<
    React.SetStateAction<MemoryCardType | undefined>
  >;
  nClicks: number;
  setNClicks: React.Dispatch<React.SetStateAction<number>>;
  ncards: number | undefined;
  setNcards: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const VoiceListener: React.FC<SpeechRecognitionProps> = ({
  cards,
  setCards,
  previousCard,
  setPreviousCard,
  nClicks,
  setNClicks,
  ncards,
  setNcards,
}) => {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const handleCardClick = (card: MemoryCardType) => {
      if (previousCard?.id === card.id) return;
      setNClicks((prev) => prev + 1);

      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, isFlipped: !c.isFlipped } : c,
        ),
      );

      PlaySound(card.parrot);
      if (previousCard === undefined) {
        setPreviousCard(card);
      } else {
        if (previousCard.parrot === card.parrot) {
          setPreviousCard(undefined);
          winSound.volume(0.2);
          winSound.play();
        } else {
          loseSound.volume(0.3);
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
    const startListening = (currentCards: MemoryCardType[]) => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.continuous = true;
        // recognition.
        recognition.onresult = (event: typeof SpeechRecognition) => {
          const command = event.results[0][0].transcript;
          // setListening(false);
          setListening(false);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          handleVoiceCommand(command, currentCards, setNcards, handleCardClick);

          //
        };

        recognition.onerror = (event: unknown) => {
          console.error("Erro de reconhecimento de fala:", event);
        };

        setListening(true);
        recognition.start();
      } else {
        console.error(
          "Reconhecimento de fala não é suportado neste navegador.",
        );
      }
    };
    if (!listening) {
      startListening(cards);
    }
  }, [
    cards,
    listening,
    setNcards,
    setCards,
    setNClicks,
    previousCard,
    setPreviousCard,
  ]);

  return (
    <Button
      onClick={() => setListening(!listening)}
      className={`flex items-center ${listening ? "bg-green-500" : "bg-gray-500"}`}
    >
      {listening ? (
        <Mic size={16} className="mr-2 animate-pulse" />
      ) : (
        <MicOff size={16} className="mr-2" />
      )}
      {listening ? "Ouvindo..." : "Comando de voz"}
    </Button>
  );
};

export default VoiceListener;
