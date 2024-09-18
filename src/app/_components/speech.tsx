/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionProps {
  flipCardByIndex: (index: number) => void;
  selectNumberOfCards: (n: number) => void;
}

const VoiceCommand: React.FC<SpeechRecognitionProps> = ({
  flipCardByIndex,
  selectNumberOfCards,
}) => {
  const [listening, setListening] = useState(false);

  // Function to extract the number from the command (e.g., "Carta 1" -> 1)
  const extractCardNumber = (command: string): number | null => {
    const match = /\d+/.exec(command); // Extract any digits from the string
    return match ? parseInt(match[0], 10) - 1 : null; // Return zero-indexed card number
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    const cardNumber = extractCardNumber(lowerCommand);

    switch (true) {
      case lowerCommand.includes("virar cartão"):
        flipCardByIndex(0); // Zero-indexed for "Carta 1"
        break;
      case /iniciar|jogar|começar/.test(lowerCommand):
        selectNumberOfCards(4);
        break;
      case /quatro cartas|4 cartas/.test(lowerCommand):
        selectNumberOfCards(4);
        break;
      case /seis cartas|6 cartas/.test(lowerCommand):
        selectNumberOfCards(6);
        break;
      case /oito cartas|8 cartas/.test(lowerCommand):
        selectNumberOfCards(8);
        break;
      case /quatorze cartas|14 cartas|catorze cartas/.test(lowerCommand):
        selectNumberOfCards(14);
        break;
      case lowerCommand.includes("virar carta") && cardNumber !== null:
        // Flip the specified card if a valid number is provided
        flipCardByIndex(cardNumber);
        break;
      default:
        console.log(`Comando desconhecido: ${command}`);
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
        console.error("Erro de reconhecimento de fala:", event);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      setListening(true);
      recognition.start();
    } else {
      console.error("Reconhecimento de fala não é suportado neste navegador.");
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
