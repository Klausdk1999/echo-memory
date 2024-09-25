import { type MemoryCardType } from "./game";

const numberMap: Record<string, number> = {
  um: 1,
  dois: 2,
  três: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  quatorze: 14,
  catorze: 14,
};

const extractCardNumber = (command: string): number | null => {
  const match = /\d+/.exec(command);
  if (match) {
    return parseInt(match[0], 10) - 1;
  }

  const words = command.split(/\s+/);
  for (const word of words) {
    if (numberMap[word]) {
      return numberMap[word] - 1;
    }
  }

  return null;
};

export const handleVoiceCommand = (
  command: string,
  cards: MemoryCardType[],
  setNcards: React.Dispatch<React.SetStateAction<number | undefined>>,
  handleCardClick: (card: MemoryCardType) => void,
) => {
  console.log("Comando de voz:", command);
  const lowerCommand = command.toLowerCase();
  const cardNumber = extractCardNumber(lowerCommand);
  console.log(cards);
  switch (true) {
    case lowerCommand.includes("virar cartão"): {
      console.log(`virar`, 0);
      const selectedCard = cards[0];
      if (!selectedCard) return;
      handleCardClick(selectedCard);
      break;
    }
    case /virar (cartão|carta)|tirar (cartão|carta)/.test(lowerCommand): {
      console.log(`virar`, cardNumber);
      if (cardNumber === null) break;
      const selectedCard = cards[cardNumber];
      if (!selectedCard) return;
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
