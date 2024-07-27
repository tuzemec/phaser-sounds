import { Show, createMemo } from "solid-js";
import { type ContinuousRange, RangeType } from "solid-knobs";
import { type MonoSynth, type PolySynth, Time } from "tone";
import { useGameContext } from "../context/SoundSceneContext";
import { Source } from "../game/objects/Source";
import FilterEditor from "./FilterEditor";
import Knob from "./Knob";
import SynthEditor from "./SynthEditor";

const volumeRange: ContinuousRange = {
  type: RangeType.Continuous,
  start: -50,
  end: 1,
  step: 1,
  valueToString: (v) => String(Math.round(v)),
};

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

  const intervalTime = createMemo<string>(() => {
    if (source()?.loop) {
      return Time(source()!.loop.interval).toBarsBeatsSixteenths();
    }

    return "1:0:0";
  });

  return (
    <Show when={source() && synth()}>
      <div class="editor">
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            {/* <Knob range={volumeRange} defaultValue={synth()!.get().volume} /> */}
            <Knob
              label="Vol"
              onChange={(v) => synth()!.set({ volume: v })}
              range={volumeRange}
              defaultValue={synth()!.get().volume}
            />
          </fieldset>

          <fieldset>
            <Knob
              label="Interval"
              readOnlyInput
              onChange={(v) => {
                source()!.loop.interval = INTERVALS[v];
              }}
              defaultValue={INTERVALS.indexOf(intervalTime())}
              range={{
                type: RangeType.Choice,
                choices: INTERVALS.map((i, idx) => ({ value: idx, label: i })),
              }}
            />
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
            <span>
              <button
                type="button"
                onClick={() => {
                  state.scene?.removeSource(source()!);
                }}
              >
                remove
              </button>
            </span>
          </fieldset>
        </form>
      </div>
      <SynthEditor />
      <FilterEditor />
    </Show>
  );
}
