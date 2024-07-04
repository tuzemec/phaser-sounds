import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { SoundScene } from "./scenes/SoundScene";

// colors:
// https://coolors.co/palette/003049-d62828-f77f00-fcbf49-eae2b7

// const scale = window.devicePixelRatio;
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  backgroundColor: "#003049",
  scene: [Boot, Preloader, SoundScene],
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: {
        x: 0,
        y: 0.33,
      },
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
