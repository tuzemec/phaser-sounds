import * as Tone from "tone";
import { useGameContext } from "../context/SoundSceneContext";

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
          Tone.start();
          Tone.getTransport().start();
        }}
      >
        START
      </button>
      <button
        type="button"
        onClick={() => {
          Tone.getTransport().stop();
        }}
      >
        STOP
      </button>
    </div>
  );
}
