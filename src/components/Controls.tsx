import * as Tone from "tone";
import { EventBus } from "../game/EventBus";

export default function () {
  return (
    <div class="controls">
      <button onClick={() => EventBus.emit("global.add.source")} type="button">
        + source
      </button>
      <button
        onClick={() => EventBus.emit("global.add.platform")}
        type="button"
      >
        + platform
      </button>
      <button
        type="button"
        onClick={() => {
          Tone.start();
          EventBus.emit("global.start");
        }}
      >
        START
      </button>
      <button type="button" onClick={() => EventBus.emit("global.stop")}>
        STOP
      </button>
    </div>
  );
}
