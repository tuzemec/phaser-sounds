import { For, createSignal } from "solid-js";
import type { FilterRollOff } from "tone";
import { useGameContext } from "../context/SoundSceneContext";
import type { Source } from "../game/objects/Source";
import EnvelopeEditor from "./EnvelopeEditor";

const FLT_TYPES: BiquadFilterType[] = [
  "lowpass",
  "highpass",
  "bandpass",
  "highshelf",
  "lowshelf",
];

const FLT_ROLL = [-12, -24, -48, -96];

const FilterEditor = () => {
  const [state] = useGameContext();
  const source = state.selected as Source;
  const synth = source.synth;

  const [freq, setFreq] = createSignal(
    synth.get().filterEnvelope.baseFrequency,
  );

  const [octaves, setOctaves] = createSignal(
    synth.get().filterEnvelope.octaves,
  );

  const [q, setQ] = createSignal(synth.get().filter.Q);

  return (
    <div class="editor">
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <label>
            <span>Filter:</span>
            <select
              value={synth.get().filter.type}
              onChange={(e) =>
                synth.set({
                  filter: { type: e.target.value as BiquadFilterType },
                })
              }
            >
              <For each={FLT_TYPES}>
                {(t) => <option value={t}>{t}</option>}
              </For>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <label>
            <span>db/oct:</span>
            <select
              value={synth.get().filter.rolloff}
              onChange={(e) =>
                synth.set({
                  filter: {
                    rolloff: e.target.value as unknown as FilterRollOff,
                  },
                })
              }
            >
              <For each={FLT_ROLL}>{(t) => <option value={t}>{t}</option>}</For>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <label>
            <span>Freq:</span>
            <input
              title={freq().toString()}
              type="range"
              value={freq()}
              min={50}
              max={22000}
              onInput={(e) => {
                setFreq(e.target.value);
                synth.set({
                  filterEnvelope: { baseFrequency: e.target.value },
                });
              }}
            />
          </label>
        </fieldset>

        <fieldset>
          <label>
            <span>Q:</span>
            <input
              title={freq().toString()}
              type="range"
              value={q()}
              min={0}
              max={50}
              onInput={(e) => {
                setQ(Number(e.target.value));
                synth.set({
                  filter: { Q: Number(e.target.value) },
                });
              }}
            />
          </label>
        </fieldset>

        <fieldset>
          <label>
            <span>Env:</span>
            <input
              title={octaves().toString()}
              type="range"
              value={octaves()}
              min={0}
              max={12}
              step={1}
              onInput={(e) => {
                setOctaves(Number(e.target.value));
                synth.set({
                  filterEnvelope: { octaves: Number(e.target.value) },
                });
              }}
            />
          </label>
        </fieldset>

        <EnvelopeEditor
          envelope={synth.get().filterEnvelope}
          onChange={(prop, v) => {
            synth.set({
              filterEnvelope: { [prop]: v },
            });
          }}
        />
      </form>
    </div>
  );
};

export default FilterEditor;
