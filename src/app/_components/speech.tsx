/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionProps {
  handleVoiceCommand: (command: string) => void;
}

const VoiceCommand: React.FC<SpeechRecognitionProps> = ({
  handleVoiceCommand,
}) => {
  const [listening, setListening] = useState(false);

  // Function to extract the number from the command (e.g., "Carta 1" -> 1)

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";

      recognition.onresult = (event: typeof SpeechRecognition) => {
        const command = event.results[0][0].transcript;
        // setListening(false);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        handleVoiceCommand(command);
        setTimeout(() => {
          startListening();
          // setListening(false);
        }, 500);
        //
      };

      recognition.onerror = (event: unknown) => {
        console.error("Erro de reconhecimento de fala:", event);
        setListening(false);
        recognition.stop();
      };

      setListening(true);
      recognition.start();
    } else {
      console.error("Reconhecimento de fala não é suportado neste navegador.");
    }
  };

  useEffect(() => {
    if (!listening) {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
