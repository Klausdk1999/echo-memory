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
  volume: 0.7,
});
export const winSound = new Howl({ src: ["/sounds/win.wav"], volume: 0.7 });
export const loseSound = new Howl({ src: ["/sounds/lose.wav"], volume: 0.7 });

const soundsMap = parrots.reduce(
  (map, parrot) => {
    map[parrot] = new Howl({
      src: [`/sounds/parrots/${parrot}.mp3`],
      volume: 0.5,
    });
    return map;
  },
  {} as Record<string, Howl>,
);

export const PlaySound = (parrot: string) => {
  const sound = soundsMap[parrot];
  if (sound) {
    sound.fade(1, 0, 4500);

    sound.play();
    setTimeout(() => sound.stop(), 4000);
  }
};
