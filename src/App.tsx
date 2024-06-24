import Controls from "./components/Controls";
import Editors from "./components/Editors";
import { GameContextProvider } from "./context/SoundSceneContext";
import { PhaserGame } from "./game/PhaserGame";

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
