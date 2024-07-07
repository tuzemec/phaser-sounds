import { onCleanup, onMount } from "solid-js";
import { useGameContext } from "../context/SoundSceneContext";
import { EventBus } from "./EventBus";
import StartGame from "./main";
import type { Platform } from "./objects/Platform";
import type { Source } from "./objects/Source";
import type { SoundScene } from "./scenes/SoundScene";

export const PhaserComp = () => {
  let gameContainer: HTMLDivElement | undefined;
  const [, { setGame, setScene, clearState, select, deselect }] =
    useGameContext();

  const sceneHandler = (s: SoundScene) => {
    setScene(s);
  };

  const selectHandler = (i: Platform | Source) => {
    select(i);
  };

  const deselectHandler = () => {
    deselect();
  };

  onMount(() => {
    const gameInstance = StartGame("game-container");
    setGame(gameInstance);
    EventBus.on("global.scene.ready", sceneHandler);
    EventBus.on("global.select", selectHandler);
    EventBus.on("global.deselect", selectHandler);
  });

  onCleanup(() => {
    EventBus.emit("global.deselect");

    EventBus.off("global.scene.ready", sceneHandler);
    EventBus.off("global.select", selectHandler);
    EventBus.off("global.deselect", deselectHandler);
    clearState();
  });

  return (
    <>
      <div id="game-container" ref={gameContainer} />
    </>
  );
};
