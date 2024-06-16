import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import StartGame from "./main";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export const PhaserGame = () => {
  let gameContainer: HTMLDivElement | undefined;
  const [instance, setInstance] = createStore<IRefPhaserGame>({
    game: null,
    scene: null,
  });

  onMount(() => {
    const gameInstance = StartGame("game-container");
    setInstance("game", gameInstance);

    onCleanup(() => {
      if (instance.game) {
        instance.game.destroy(true);
        setInstance({ game: null, scene: null });
      }
    });
  });

  return <div id="game-container" ref={gameContainer} />;
};
