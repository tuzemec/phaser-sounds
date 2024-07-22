import { For } from "solid-js";
import type {
  OmniOscillatorOptions,
  OmniOscillatorType,
} from "tone/build/esm/source/oscillator/OscillatorInterface";
import { useGameContext } from "../context/SoundSceneContext";
import type { Source } from "../game/objects/Source";
import EnvelopeEditor from "./EnvelopeEditor";

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
          <label>
            <span>OSC:</span>
            <select
              value={synth.get().oscillator.type}
              onChange={(e) =>
                synth.set({
                  oscillator: { type: e.target.value } as OmniOscillatorOptions,
                })
              }
            >
              <For each={OSC}>
                {(osc) => <option value={osc}>{osc}</option>}
              </For>
            </select>
          </label>
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
