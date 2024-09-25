/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

const CommandList = () => (
  <Popover>
    <PopoverTrigger className="items-center rounded-md bg-blue-500 px-4 text-white hover:bg-blue-600">
      <HelpCircle className="mr-2 inline-block h-5 w-5" />
      Comandos
    </PopoverTrigger>
    <PopoverContent className="w-[400px] rounded bg-white p-4 shadow-md">
      <p className="text-gray-800">
        Caso seu navegador seja compatível, você pode utilizar comandos de voz
        para jogar. Atualmente somente o Mozilla Firefox não suporta essa
        função.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li className="text-gray-800">
          <strong>Iniciar jogo:</strong> Diga{" "}
          <em>"iniciar", "jogar" ou "começar"</em> para começar o jogo com 4
          cartas.
        </li>
        <li className="text-gray-800">
          <strong>Virar carta:</strong> Diga{" "}
          <em>"virar carta" ou "tirar carta"</em> seguido de um número para
          virar uma carta específica.
        </li>
        <li className="text-gray-800">
          <strong>Quatro cartas:</strong> Diga{" "}
          <em>"quatro cartas" ou "4 cartas"</em> para jogar com 4 cartas.
        </li>
        <li className="text-gray-800">
          <strong>Seis cartas:</strong> Diga{" "}
          <em>"seis cartas" ou "6 cartas"</em> para jogar com 6 cartas.
        </li>
        <li className="text-gray-800">
          <strong>Oito cartas:</strong> Diga{" "}
          <em>"oito cartas" ou "8 cartas"</em> para jogar com 8 cartas.
        </li>
        <li className="text-gray-800">
          <strong>Quatorze cartas:</strong> Diga{" "}
          <em>"quatorze cartas", "catorze cartas" ou "14 cartas"</em> para jogar
          com 14 cartas.
        </li>
      </ul>
    </PopoverContent>
  </Popover>
);

export default CommandList;
