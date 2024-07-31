import { For, createSignal } from "solid-js";
import { RangeType } from "solid-knobs";
import { type FilterRollOff, Frequency } from "tone";
import { useGameContext } from "../context/SoundSceneContext";
import type { Source } from "../game/objects/Source";
import EnvelopeEditor from "./EnvelopeEditor";
import Knob from "./Knob";

const FLT_TYPES: BiquadFilterType[] = [
  "lowpass",
  "highpass",
  "bandpass",
  "highshelf",
  "lowshelf",
];

const FLT_SLOPE: FilterRollOff[] = [-12, -24, -48, -96];

const FilterEditor = () => {
  const [state] = useGameContext();
  const source = state.selected as Source;
  const synth = source.synth;

  const [octaves, setOctaves] = createSignal(
    synth.get().filterEnvelope.octaves,
  );

  const [q, setQ] = createSignal(synth.get().filter.Q);

  return (
    <div class="editor">
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <Knob
            label="Filter"
            defaultValue={FLT_TYPES.indexOf(synth.get().filter.type)}
            readOnlyInput
            range={{
              type: RangeType.Choice,
              choices: FLT_TYPES.map((o, idx) => ({
                value: idx,
                label: o,
              })),
            }}
            onChange={(v) => {
              synth.set({
                filter: { type: FLT_TYPES[v] },
              });
            }}
          />
        </fieldset>

        <fieldset>
          <Knob
            label="Slope"
            defaultValue={FLT_SLOPE.indexOf(synth.get().filter.rolloff)}
            readOnlyInput
            range={{
              type: RangeType.Choice,
              choices: FLT_SLOPE.map((o, idx) => ({
                value: idx,
                label: o.toString(),
              })),
            }}
            onChange={(v) => {
              synth.set({
                filter: { rolloff: FLT_SLOPE[v] },
              });
            }}
          />
        </fieldset>

        <fieldset>
          <Knob
            label="Freq"
            defaultValue={Frequency(
              synth.get().filterEnvelope.baseFrequency,
            ).toFrequency()}
            range={{
              type: RangeType.Continuous,
              start: 50,
              end: 20000,
              step: 1,
              valueToString: (v) => Math.ceil(v).toString(),
            }}
            onChange={(v) => {
              synth.set({
                filterEnvelope: { baseFrequency: v },
              });
            }}
          />
        </fieldset>

        <fieldset>
          <Knob
            label="Q"
            defaultValue={synth.get().filter.Q}
            range={{
              type: RangeType.Continuous,
              start: 1,
              end: 50,
            }}
            onChange={(v) => {
              synth.set({
                filter: { Q: v },
              });
            }}
          />
        </fieldset>

        <fieldset>
          <Knob
            label="Env"
            defaultValue={synth.get().filterEnvelope.octaves}
            range={{
              type: RangeType.Continuous,
              start: 0,
              step: 1,
              end: 12,
            }}
            onChange={(v) => {
              synth.set({
                filterEnvelope: { octaves: v },
              });
            }}
          />
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
