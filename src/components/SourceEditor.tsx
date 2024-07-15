import { For, Show, createMemo } from "solid-js";
import { Time } from "tone";
import { useGameContext } from "../context/SoundSceneContext";
import { Source } from "../game/objects/Source";
import SynthEditor from "./SynthEditor";

const INTERVALS = [
  "0:1:0",
  "0:2:0",
  "0:3:0",
  "1:0:0",
  "1:1:0",
  "1:2:0",
  "1:3:0",
  "2:0:0",
];

export default function PlatformEditor() {
  const [state] = useGameContext();

  const source = createMemo<Source | null>(() => {
    if (state.selected && state.selected instanceof Source) {
      return state.selected as Source;
    }
    return null;
  });

  const intervalTime = createMemo<string | null>(() => {
    if (source()?.loop) {
      return Time(source()!.loop.interval).toBarsBeatsSixteenths();
    }

    return null;
  });

  return (
    <Show when={source()}>
      <div class="editor">
        <form>
          <fieldset>
            <label>
              <span>interval:</span>
              <select
                value={intervalTime() || ""}
                onChange={(e) => {
                  source()!.loop.interval = e.target.value;
                }}
              >
                <For each={INTERVALS}>
                  {(i) => <option value={i}>{i}</option>}
                </For>
              </select>
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span>muted</span>
              <input
                type="checkbox"
                checked={source()?.muted}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    source()!.loop.mute = true;
                  } else {
                    source()!.loop.mute = false;
                  }
                }}
              />
            </label>
          </fieldset>

          <fieldset>
            <button
              type="button"
              onClick={() => {
                state.scene?.removeSource(source()!);
              }}
            >
              remove
            </button>
          </fieldset>
        </form>
      </div>
      <SynthEditor />
    </Show>
  );
}
