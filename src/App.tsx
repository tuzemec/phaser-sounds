import Controls from "./components/Controls";
import { GameContextProvider } from "./context/SoundSceneContext";
import { PhaserComp } from "./game/PhaserComp";

const App = () => {
  return (
    <GameContextProvider>
      <div id="app">
        <Controls />
        <PhaserComp />
      </div>
    </GameContextProvider>
  );
};

export default App;
