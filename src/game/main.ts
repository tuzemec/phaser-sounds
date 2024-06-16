import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { SoundScene } from "./scenes/SoundScene";

// const scale = window.devicePixelRatio;
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  backgroundColor: "#002233",
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
