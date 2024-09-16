/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { type CardType } from "../page";

interface SpeechRecognitionProps {
  startGame: () => void;
  selectCard: (card: CardType) => void;
  selectNumberOfCards: (n: number) => void;
}

const VoiceCommand: React.FC<SpeechRecognitionProps> = ({
  startGame,
  selectCard,
  selectNumberOfCards,
}) => {
  const handleVoiceCommand = (command: string) => {
    switch (
      command.toLowerCase()
    ) {
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        handleVoiceCommand(command);
      };

      recognition.onerror = (event: unknown) => {
        console.error("Speech recognition error:", event);
      };

      recognition.start();
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }
  };

  return (
    <div>
      <button onClick={startListening}>Start Voice Command</button>
    </div>
  );
};

export default VoiceCommand;
