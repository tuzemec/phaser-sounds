import { useGameContext } from "../game/PhaserGameContext";

export default function () {
  const [state] = useGameContext();

  return (
    <div class="controls">
      <button onClick={() => state.scene?.addSource()} type="button">
        + source
      </button>
      <button onClick={() => state.scene?.addPlatform()} type="button">
        + platform
      </button>
      <button
        type="button"
        onClick={() => {
          state.scene?.startSources();
        }}
      >
        START
      </button>
      <button
        type="button"
        onClick={() => {
          state.scene?.stopSources();
        }}
      >
        STOP
      </button>
    </div>
  );
}
