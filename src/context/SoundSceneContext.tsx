import { type ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import * as Tone from "tone";
import { Platform } from "../game/objects/Platform";
import { Source } from "../game/objects/Source";
import type { SoundScene } from "../game/scenes/SoundScene";

type GameState = {
  game: Phaser.Game | null;
  scene: SoundScene | null;
  selected: Source | Platform | null;
  playing: boolean;
  initialized: boolean;
  aboutOpened: boolean;
};

type GameActions = {
  setGame: (g: Phaser.Game) => void;
  setScene: (s: SoundScene) => void;
  clearState: () => void;
  select: (item: Source | Platform) => void;
  deselect: () => void;
  toggle: () => void;
  removeSelected: () => void;
  updatePlatform: () => void;
  toggleAbout: () => void;
};

type GameStore = [GameState, GameActions];

const GameContext = createContext<GameStore>([
  {
    game: null,
    scene: null,
    selected: null,
    playing: false,
    initialized: false,
    aboutOpened: false,
  },
  {
    setGame: () => undefined,
    setScene: () => undefined,
    clearState: () => undefined,
    select: () => undefined,
    deselect: () => undefined,
    toggle: () => undefined,
    removeSelected: () => undefined,
    updatePlatform: () => undefined,
    toggleAbout: () => undefined,
  },
]);

export const GameContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<GameState>({
    game: null,
    scene: null,
    selected: null,
    playing: false,
    initialized: false,
    aboutOpened: false,
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
      removeSelected() {
        if (!state.selected) return;

        if (state.selected instanceof Platform)
          state.scene?.removePlatform(state.selected);

        if (state.selected instanceof Source)
          state.scene?.removeSource(state.selected);
      },
      updatePlatform() {
        console.log("update platform", state);
      },
      toggleAbout() {
        setState("aboutOpened", (s) => !s);
      },
    },
  ];

  return (
    <GameContext.Provider value={store}>{props.children}</GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
