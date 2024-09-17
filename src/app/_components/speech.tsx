/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from "react";
import { type MemoryCardType } from "../page";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionProps {
  startGame: () => void;
  selectCard: (card: MemoryCardType) => void;
  selectNumberOfCards: (n: number) => void;
}

const VoiceCommand: React.FC<SpeechRecognitionProps> = ({
  startGame,
  selectCard,
  selectNumberOfCards,
}) => {
  const [listening, setListening] = useState(false);

  const handleVoiceCommand = (command: string) => {
    switch (command.toLowerCase()) {
      case "iniciar":
      case "jogar":
      case "começar":
        startGame();
        break;
      case "quatro cartas":
      case "4 cartas":
        selectNumberOfCards(4);
        break;
      case "seis cartas":
      case "6 cartas":
        selectNumberOfCards(6);
        break;
      case "oito cartas":
      case "8 cartas":
        selectNumberOfCards(8);
        break;
      default:
        console.log(`Unknown command: ${command}`);
        break;
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";

      recognition.onresult = (event: typeof SpeechRecognition) => {
        const command = event.results[0][0].transcript;
        setListening(false);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        handleVoiceCommand(command);
      };

      recognition.onerror = (event: unknown) => {
        console.error("Speech recognition error:", event);
        setListening(false);
      };
      setListening(true);
      recognition.start();
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }
  };

  return (
    <Button
      onClick={startListening}
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

export default VoiceCommand;
