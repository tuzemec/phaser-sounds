import Controls from "./components/Controls";
import Editors from "./components/Editors";
import { PhaserGame } from "./game/PhaserGame";
import { GameContextProvider } from "./game/PhaserGameContext";

const App = () => {
  return (
    <GameContextProvider>
      <div id="app">
        <Editors />
        <Controls />
        <PhaserGame />
      </div>
    </GameContextProvider>
  );
};

export default App;
