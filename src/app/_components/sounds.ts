import { Howl } from "howler";

const parrots: string[] = [
  "bobrossparrot",
  "explodyparrot",
  "fiestaparrot",
  "metalparrot",
  "sailorparrot",
  "tripletsparrot",
  "unicornparrot",
];

export const victorySound = new Howl({
  src: ["/sounds/victory.mp3"],
});
export const winSound = new Howl({ src: ["/sounds/win.wav"] });
export const loseSound = new Howl({ src: ["/sounds/lose.wav"] });
export const startSound = new Howl({ src: ["/sounds/start.wav"] });

const soundsMap = parrots.reduce(
  (map, parrot) => {
    map[parrot] = new Howl({
      src: [`/sounds/parrots/${parrot}.mp3`],
    });
    return map;
  },
  {} as Record<string, Howl>,
);

export const PlaySound = (parrot: string) => {
  const sound = soundsMap[parrot];
  if (sound) {
    sound.fade(0.3, 0, 4500);
    sound.volume(0.3);
    sound.play();
    setTimeout(() => sound.stop(), 4000);
  }
};
