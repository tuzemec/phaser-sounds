import { type ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import type { Platform } from "./objects/Platform";
import type { Source } from "./objects/Source";
import type { SoundScene } from "./scenes/SoundScene";

type GameState = {
  game: Phaser.Game | null;
  scene: SoundScene | null;
  selected: Source | Platform | null;
};

type GameActions = {
  setGame: (g: Phaser.Game) => void;
  setScene: (s: SoundScene) => void;
  clearState: () => void;
  select: (item: Source | Platform) => void;
  deselect: () => void;
};

type GameStore = [GameState, GameActions];

const GameContext = createContext<GameStore>([
  {
    game: null,
    scene: null,
    selected: null,
  },
  {
    setGame: () => undefined,
    setScene: () => undefined,
    clearState: () => undefined,
    select: () => undefined,
    deselect: () => undefined,
  },
]);

export const GameContextProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<GameState>({
    game: null,
    scene: null,
    selected: null,
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
    },
  ];

  return (
    <GameContext.Provider value={store}>{props.children}</GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
