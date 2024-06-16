import Controls from "./components/Controls";
import Editors from "./components/Editors";
import { PhaserGame } from "./game/PhaserGame";

const App = () => {
  return (
    <div id="app">
      <Editors />
      <Controls />
      <PhaserGame />
    </div>
  );
};

export default App;
