import { RangeType } from "solid-knobs";
import type {
  OmniOscillatorOptions,
  OmniOscillatorType,
} from "tone/build/esm/source/oscillator/OscillatorInterface";
import { useGameContext } from "../context/SoundSceneContext";
import type { Source } from "../game/objects/Source";
import EnvelopeEditor from "./EnvelopeEditor";
import Knob from "./Knob";

const OSC: OmniOscillatorType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "pwm",
  "fatsine",
  "fatsquare",
  "fatsawtooth",
  "fattriangle",
];

const SynthEditor = () => {
  const [state] = useGameContext();
  const source = state.selected as Source;
  const synth = source.synth;

  synth.get().envelope;
  synth.get().filterEnvelope;

  return (
    <div class="editor">
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <Knob
            label="OSC"
            readOnlyInput
            defaultValue={OSC.indexOf(synth.get().oscillator.type)}
            range={{
              type: RangeType.Choice,
              choices: OSC.map((i, idx) => ({ value: idx, label: i })),
            }}
            onChange={(v) => {
              synth.set({
                oscillator: { type: OSC[v] } as OmniOscillatorOptions,
              });
            }}
          />
        </fieldset>

        <EnvelopeEditor
          envelope={synth.get().envelope}
          onChange={(prop, value) => {
            synth.set({
              envelope: { [prop]: value },
            });
          }}
        />
      </form>
    </div>
  );
};

export default SynthEditor;
