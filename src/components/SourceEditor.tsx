import { For, Show, createMemo } from "solid-js";
import { type MonoSynth, type PolySynth, Time } from "tone";
import { useGameContext } from "../context/SoundSceneContext";
import { Source } from "../game/objects/Source";
import FilterEditor from "./FilterEditor";
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

  const synth = createMemo<PolySynth<MonoSynth> | null>(() => {
    if (source()) return source()!.synth;
    return null;
  });

  const intervalTime = createMemo<string | null>(() => {
    if (source()?.loop) {
      return Time(source()!.loop.interval).toBarsBeatsSixteenths();
    }

    return null;
  });

  return (
    <Show when={source() && synth()}>
      <div class="editor">
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <label>
              <span>Vol:</span>
              <input
                title={synth()!.get().volume.toString()}
                type="range"
                value={synth()!.get().volume}
                min={-24}
                max={0}
                step={0.5}
                onInput={(e) => {
                  synth()!.set({
                    volume: Number(e.target.value),
                  });
                }}
              />
            </label>
          </fieldset>

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
                checked={source()?.loop.mute}
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
      <FilterEditor />
    </Show>
  );
}
