import { useGameContext } from "../context/SoundSceneContext";

export default function () {
  const [state, { toggle }] = useGameContext();

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
          toggle();
        }}
      >
        {state.playing ? "STOP" : "START"}
      </button>
    </div>
  );
}
