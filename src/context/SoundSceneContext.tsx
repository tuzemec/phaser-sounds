import { type ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import * as Tone from "tone";
import type { Platform } from "../game/objects/Platform";
import type { Source } from "../game/objects/Source";
import type { SoundScene } from "../game/scenes/SoundScene";

type GameState = {
  game: Phaser.Game | null;
  scene: SoundScene | null;
  selected: Source | Platform | null;
  playing: boolean;
  initialized: boolean;
};

type GameActions = {
  setGame: (g: Phaser.Game) => void;
  setScene: (s: SoundScene) => void;
  clearState: () => void;
  select: (item: Source | Platform) => void;
  deselect: () => void;
  toggle: () => void;
  updatePlatform: () => void;
};

type GameStore = [GameState, GameActions];

const GameContext = createContext<GameStore>([
  {
    game: null,
    scene: null,
    selected: null,
    playing: false,
    initialized: false,
  },
  {
    setGame: () => undefined,
    setScene: () => undefined,
    clearState: () => undefined,
    select: () => undefined,
    deselect: () => undefined,
    toggle: () => undefined,
    updatePlatform: () => undefined,
  },
]);

export const GameContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<GameState>({
    game: null,
    scene: null,
    selected: null,
    playing: false,
    initialized: false,
  });

  const store: GameStore = [
    state,
    {
      setGame(g) {
        setState("game", g);
      },
      setScene(s) {
        setState("scene", s);
      },
      clearState() {
        if (state.game) state.game.destroy(true);
        setState({
          scene: null,
          game: null,
        });
      },
      select(item) {
        setState("selected", item);
      },
      deselect() {
        setState("selected", null);
      },
      toggle() {
        if (!state.initialized) {
          Tone.start();
          setState("initialized", true);
        }

        Tone.getTransport().toggle();
        setState("playing", Tone.getTransport().state === "started");
      },
      updatePlatform() {
        console.log("update platform", state);
      },
    },
  ];

  return (
    <GameContext.Provider value={store}>{props.children}</GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
